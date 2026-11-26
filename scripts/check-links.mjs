// Tam metinlerdeki bağlantıları denetler → data/baglanti-durumu.json
//   node scripts/check-links.mjs [--dis sonuc.json]
// Serbestiyet içi bağlantılar: yönlendirme sonrası adres arşivdeki bir yazıya
// çıkıyorsa site içi bağlantıya çevrilir ("/yazilar/<slug>/"); sayfa yoksa
// (404, ana sayfaya düşen yönlendirme, eski yönetim paneli adresi) "olu" işaretlenir
// ve okuyucuda bağlantı kaldırılıp metin korunur. Dış bağlantılar için --dis ile
// verilen { url: "ok" | "olu" } sonuçları kullanılır; verilmeyenler olduğu gibi kalır.
import fs from "node:fs";
import path from "node:path";

const root = path.join(path.dirname(new URL(import.meta.url).pathname), "..");
const args = process.argv.slice(2);
const dis = args.includes("--dis") ? JSON.parse(fs.readFileSync(args[args.indexOf("--dis") + 1], "utf8")) : {};

// Arşivdeki yazılar: kimlik → slug
const pidToSlug = new Map();
for (const f of ["data/serbestiyet-arsiv.ts", "data/articles.ts"]) {
  const t = fs.readFileSync(path.join(root, f), "utf8");
  for (const m of t.matchAll(/"?id"?:\s*"a-(\d+)",\s*"?slug"?:\s*"([^"]+)"/g)) pidToSlug.set(m[1], m[2]);
}

const links = new Set();
const dir = path.join(root, "data/metinler");
for (const f of fs.readdirSync(dir).filter((x) => /^\d+\.json$/.test(x))) {
  const s = fs.readFileSync(path.join(dir, f), "utf8");
  for (const m of s.matchAll(/href=\\"([^"\\]+)\\"/g)) links.add(m[1].replace(/&amp;/g, "&"));
}

const out = {};
const isSb = (u) => /^https?:\/\/(www\.|panel\.)?serbestiyet\.com/i.test(u);
for (const u of [...links].sort()) {
  if (!isSb(u)) {
    out[u] = dis[u] ?? "denetlenmedi";
    continue;
  }
  if (/panel\.serbestiyet\.com/.test(u)) { out[u] = "olu"; continue; }
  let final = null, status = 0;
  try {
    const r = await fetch(u, { redirect: "follow", headers: { "User-Agent": "Mozilla/5.0 (arsiv)" } });
    status = r.status; final = r.url;
    await r.arrayBuffer();
  } catch { status = 0; }
  const pid = final?.match(/-(\d+)\/?(?:[?#].*)?$/)?.[1];
  if (status === 200 && pid && pidToSlug.has(pid) && /serbestiyet\.com\/(yazarlar|gunun-yazilari|haberler)/.test(final)) out[u] = `/yazilar/${pidToSlug.get(pid)}/`;
  else if (status === 200 && !/anasayfa/.test(final)) out[u] = "ok";
  else out[u] = "olu";
}
fs.writeFileSync(path.join(root, "data/baglanti-durumu.json"), JSON.stringify(out, null, 1));
const c = {};
for (const v of Object.values(out)) { const k = v.startsWith("/") ? "site-ici" : v; c[k] = (c[k] || 0) + 1; }
console.log(links.size, "bağlantı:", c);
