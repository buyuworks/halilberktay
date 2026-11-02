// Ham Serbestiyet indeks dosyalarını okur, tekilleştirir.
import fs from "node:fs";
import path from "node:path";
const dir = path.join(path.dirname(new URL(import.meta.url).pathname), "../data/raw");
export function loadRaw() {
  const rows = [];
  for (const f of fs.readdirSync(dir).sort()) {
    const txt = fs.readFileSync(path.join(dir, f), "utf8");
    for (const line of txt.split("\n")) {
      if (!line.trim()) continue;
      const parts = f.endsWith(".tsv") ? line.split("\t") : line.split(" | ");
      if (parts.length < 4) { console.error("SKIP", f, line.slice(0, 80)); continue; }
      const [date, title, url, ...rest] = parts.map((s) => s.trim());
      const pid = Number(url.match(/-(\d+)\/?$/)?.[1]);
      rows.push({ date, title, url, summary: rest.join(" | "), pid, file: f });
    }
  }
  const byPid = new Map();
  for (const r of rows) if (!byPid.has(r.pid)) byPid.set(r.pid, r);
  // aynı başlık + aynı gün (çift yayın) tekilleştir
  const seen = new Set(); const out = [];
  for (const r of byPid.values()) {
    const k = r.date + "|" + r.title.replace(/[“”"']/g, "").toLowerCase();
    if (seen.has(k)) continue; seen.add(k); out.push(r);
  }
  return out.sort((a, b) => b.date.localeCompare(a.date) || b.pid - a.pid);
}
if ((process.argv[1] ?? "").endsWith("parse-raw.mjs")) {
  const r = loadRaw();
  console.log("total", r.length, "years", Object.entries(r.reduce((m, x) => ((m[x.date.slice(0, 4)] = (m[x.date.slice(0, 4)] || 0) + 1), m), {})).join(" "));
  for (const x of r) if (/\(\s*\d+[ab]?\s*\)|^\(?\d+\)|\b(?:Meğer|Not|Sorular|İstifa)\s*\(?\d/.test(x.title)) console.log(x.date, x.pid, x.title);
}
