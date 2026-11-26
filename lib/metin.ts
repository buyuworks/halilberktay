import fs from "node:fs";
import path from "node:path";
import BAGLANTI from "@/data/baglanti-durumu.json";

/* Tam metin okuyucu: data/metinler/<kimlik>.json (yalnız sunucu/derleme anında).
   html alanları scripts/fetch-metinler.mjs tarafından temizlenmiştir: yalnız
   em, strong, u, sup, sub, br ve dış bağlantı (a) etiketleri kalır. */

export type MetinBlock =
  | { type: "p" | "h2" | "quote"; html: string }
  | { type: "ul" | "ol"; items: string[] };

export interface Metin {
  pid: number;
  url: string;
  title: string;
  words: number;
  blocks: MetinBlock[];
}

const DURUM = BAGLANTI as Record<string, string>;

/** Bağlantıları denetim sonucuna göre düzenler (scripts/check-links.mjs):
    arşivdeki yazıya çıkanlar site içine döner, ölü bağlantılar kaldırılıp metin korunur,
    diğerleri yeni sekmede açılır. */
function fixLinks(h: string) {
  return h.replace(/<a href="([^"]+)">([\s\S]*?)<\/a>/g, (_, href: string, inner: string) => {
    const d = DURUM[href.replace(/&amp;/g, "&")];
    if (d === "olu") return inner;
    if (d?.startsWith("/")) return `<a href="${d}">${inner}</a>`;
    return `<a href="${href}" target="_blank" rel="noopener noreferrer">${inner}</a>`;
  });
}

const plain = (h: string) => h.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim();

export function getMetin(articleId: string): Metin | null {
  const pid = articleId.replace(/^a-/, "");
  if (!/^\d+$/.test(pid)) return null;
  const f = path.join(process.cwd(), "data/metinler", `${pid}.json`);
  if (!fs.existsSync(f)) return null;
  const m = JSON.parse(fs.readFileSync(f, "utf8")) as Metin;
  // Kaynağın başa koyduğu yazar adı satırını at (sayfada zaten var)
  const first = m.blocks[0];
  if (first && "html" in first && /^Halil Berktay$/i.test(plain(first.html))) m.blocks = m.blocks.slice(1);
  // Paragrafın başında <br> ile ayrılmış kısa ara başlık → ayrı başlık bloğu
  m.blocks = m.blocks.flatMap((b): MetinBlock[] => {
    if (b.type !== "p") return [b];
    const k = b.html.indexOf("<br>");
    if (k < 0) return [b];
    const head = b.html.slice(0, k).trim();
    const rest = b.html.slice(k + 4).trim();
    const ph = plain(head);
    if (ph.length < 3 || ph.length > 90 || /[.,;:!?…"”]$/.test(ph) || rest.includes("<br>") || plain(rest).length < 200) return [b];
    return [{ type: "h2", html: head }, { type: "p", html: rest }];
  });
  m.blocks = m.blocks.map((b) => ("html" in b ? { ...b, html: fixLinks(b.html) } : { ...b, items: b.items.map(fixLinks) }));
  return m;
}

export const startsWithLetter = (h: string) => /^[\p{L}]/u.test(plain(h));
