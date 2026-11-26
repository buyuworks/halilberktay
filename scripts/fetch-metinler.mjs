// Serbestiyet yazılarının tam metinlerini kaynağından çeker ve
// data/metinler/<yazıKimliği>.json olarak kaydeder.
//   node scripts/fetch-metinler.mjs [--cache /geçici/klasör] [--force]
// Yazı listesi data/raw/* dosyalarından ve data/articles.ts içindeki
// Serbestiyet bağlantılarından okunur. Metin kaynaktaki gibidir; yalnız
// biçim (paragraf, ara başlık, alıntı, italik/kalın, dipnot) korunur,
// reklam/betik/paylaşım öğeleri atılır.
import fs from "node:fs";
import path from "node:path";
import { parse } from "node-html-parser";
import { loadRaw } from "./parse-raw.mjs";

const root = path.join(path.dirname(new URL(import.meta.url).pathname), "..");
const outDir = path.join(root, "data/metinler");
const args = process.argv.slice(2);
const cacheDir = args.includes("--cache") ? args[args.indexOf("--cache") + 1] : null;
const force = args.includes("--force");
fs.mkdirSync(outDir, { recursive: true });
if (cacheDir) fs.mkdirSync(cacheDir, { recursive: true });

// ——— Liste
const jobs = new Map(); // pid -> url
for (const r of loadRaw()) jobs.set(String(r.pid), r.url);
const curated = fs.readFileSync(path.join(root, "data/articles.ts"), "utf8");
for (const m of curated.matchAll(/id: "a-(\d+)"[\s\S]*?externalUrl: `\$\{S\}([^`]+)`/g)) jobs.set(m[1], "https://serbestiyet.com" + m[2]);

// ——— Temizleme
const INLINE = new Set(["em", "i", "strong", "b", "sup", "sub", "a", "br", "u"]);
const esc = (s) => s.replace(/&(?![a-zA-Z#0-9]+;)/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
function inline(node) {
  let s = "";
  for (const c of node.childNodes) {
    if (c.nodeType === 3) s += esc(c.rawText);
    else if (c.nodeType === 1) {
      const t = c.rawTagName?.toLowerCase();
      if (["script", "style", "ins", "noscript", "iframe", "figure", "img"].includes(t)) continue;
      if (t === "br") s += "<br>";
      else if (t === "a") {
        const href = c.getAttribute("href") ?? "";
        const inner = inline(c);
        s += /^https?:\/\//.test(href) ? `<a href="${href.replace(/"/g, "&quot;")}">${inner}</a>` : inner;
      } else if (INLINE.has(t)) {
        const tag = t === "b" ? "strong" : t === "i" ? "em" : t;
        const inner = inline(c);
        s += inner.trim() ? `<${tag}>${inner}</${tag}>` : inner;
      } else s += inline(c);
    }
  }
  return s;
}
const clean = (h) => h.replace(/ /g, " ").replace(/(<br>\s*)+$/g, "").replace(/^(\s*<br>)+/g, "").replace(/\s+/g, " ").trim();
const plain = (h) => h.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim();

function extract(html) {
  const d = parse(html);
  const body = d.querySelector(".single-post-content") ?? d.querySelector(".td-post-content");
  if (!body) return null;
  const blocks = [];
  const walk = (el) => {
    for (const c of el.childNodes) {
      if (c.nodeType !== 1) continue;
      const t = c.rawTagName?.toLowerCase();
      const cls = c.getAttribute("class") ?? "";
      if (["script", "style", "ins", "noscript", "iframe", "figure", "img", "form", "button"].includes(t)) continue;
      if (/share|sharedaddy|related|jp-relatedposts|code-block|advert|tdb-|td-a-rec/.test(cls)) continue;
      if (t === "p") {
        const h = clean(inline(c));
        if (plain(h)) blocks.push({ type: "p", html: h });
      } else if (/^h[2-6]$/.test(t)) {
        const h = clean(inline(c));
        if (plain(h)) blocks.push({ type: "h2", html: h });
      } else if (t === "blockquote") {
        const ps = c.querySelectorAll("p");
        const h = ps.length ? ps.map((p) => clean(inline(p))).filter((x) => plain(x)).join("<br><br>") : clean(inline(c));
        if (plain(h)) blocks.push({ type: "quote", html: h });
      } else if (t === "ul" || t === "ol") {
        const items = c.querySelectorAll("li").map((li) => clean(inline(li))).filter((x) => plain(x));
        if (items.length) blocks.push({ type: t, items });
      } else if (["div", "section", "span", "table", "tbody", "thead", "tr", "td", "center"].includes(t)) walk(c);
    }
  };
  walk(body);
  const meta = (p) => d.querySelector(`meta[property="${p}"]`)?.getAttribute("content");
  return {
    title: plain(d.querySelector("h1")?.innerHTML ?? "").replace(/&#8217;/g, "’"),
    published: meta("article:published_time") ?? null,
    blocks,
  };
}

async function get(url) {
  for (let i = 0; i < 4; i++) {
    try {
      const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (arsiv)" }, redirect: "follow" });
      if (r.status === 429 || r.status >= 500) throw new Error("HTTP " + r.status);
      return { status: r.status, finalUrl: r.url, html: await r.text() };
    } catch (e) {
      if (i === 3) return { status: 0, error: String(e) };
      await new Promise((s) => setTimeout(s, 1500 * (i + 1)));
    }
  }
}

const list = [...jobs.entries()];
let done = 0, ok = 0;
const failed = [];
async function worker() {
  while (list.length) {
    const [pid, url] = list.shift();
    const out = path.join(outDir, `${pid}.json`);
    if (!force && fs.existsSync(out)) { done++; ok++; continue; }
    const cached = cacheDir && path.join(cacheDir, `${pid}.html`);
    let res;
    if (cached && fs.existsSync(cached)) res = { status: 200, finalUrl: url, html: fs.readFileSync(cached, "utf8") };
    else {
      res = await get(url);
      if (cached && res.status === 200) fs.writeFileSync(cached, res.html);
    }
    done++;
    const x = res.status === 200 ? extract(res.html) : null;
    if (!x || !x.blocks.length) { failed.push({ pid, url, status: res.status, error: res.error }); continue; }
    const words = x.blocks.map((b) => plain(b.html ?? b.items.join(" "))).join(" ").split(/\s+/).length;
    fs.writeFileSync(out, JSON.stringify({ pid: +pid, url, finalUrl: res.finalUrl, title: x.title, published: x.published, words, blocks: x.blocks }));
    ok++;
    if (done % 50 === 0) console.log(`${done}/${jobs.size}`);
  }
}
await Promise.all(Array.from({ length: 4 }, worker));
console.log(`tamam: ${ok}/${jobs.size}, hata: ${failed.length}`);
if (failed.length) fs.writeFileSync(path.join(root, "data/metinler/_hatalar.json"), JSON.stringify(failed, null, 1));
