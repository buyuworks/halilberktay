import Fuse from "fuse.js";
import type { ArchiveEntry } from "@/lib/content";
import { fold } from "@/lib/format";

/* ------------------------------------------------------------------
   ARAMA MOTORU (istemci tarafı)
   - Türkçe karakterleri katlar: "milli mucadele" = "Millî Mücadele"
   - Başlık > dizi > özet > mecra/etiket ağırlıklandırması
   - Bulanık eşleşme (yazım hatalarına tolerans)
------------------------------------------------------------------- */

type Doc = { e: ArchiveEntry; title: string; summary: string; meta: string };

export function createSearcher(entries: ArchiveEntry[], topicLabel: (t: string) => string) {
  const docs: Doc[] = entries.map((e) => ({
    e,
    title: fold(e.title),
    summary: fold(e.summary ?? ""),
    meta: fold([e.source, e.seriesLabel, e.kind, e.citation, e.type, ...e.tags.map(topicLabel), e.year].filter(Boolean).join(" ")),
  }));
  const fuse = new Fuse(docs, {
    keys: [
      { name: "title", weight: 0.55 },
      { name: "summary", weight: 0.25 },
      { name: "meta", weight: 0.2 },
    ],
    includeScore: true,
    ignoreLocation: true,
    threshold: 0.34,
    minMatchCharLength: 2,
    useExtendedSearch: false,
  });

  return function search(q: string): ArchiveEntry[] {
    const query = fold(q.trim());
    if (!query) return entries;
    // Çok kelimeli sorgularda her kelimenin bir alanda geçmesini tercih et
    const words = query.split(/\s+/).filter((w) => w.length > 1);
    const exact = docs.filter((d) => words.every((w) => d.title.includes(w) || d.summary.includes(w) || d.meta.includes(w)));
    // Tam eşleşme varsa yalnızca çok yakın bulanık sonuçları ekle (gürültüyü önler)
    const fuzzy = fuse
      .search(query)
      .filter((r) => (exact.length ? (r.score ?? 1) < 0.12 : true))
      .map((r) => r.item);
    const seen = new Set<string>();
    const out: ArchiveEntry[] = [];
    // tam eşleşmeler önce, başlık eşleşmesi en önde
    exact
      .sort((a, b) => Number(words.some((w) => b.title.includes(w))) - Number(words.some((w) => a.title.includes(w))))
      .concat(fuzzy)
      .forEach((d) => {
        if (!seen.has(d.e.id)) {
          seen.add(d.e.id);
          out.push(d.e);
        }
      });
    return out;
  };
}

/** Metinde sorgu kelimelerini <mark> için parçalara ayırır (Türkçe katlamayla) */
export function highlightParts(text: string, q: string): { t: string; hit: boolean }[] {
  const words = fold(q.trim())
    .split(/\s+/)
    .filter((w) => w.length > 1);
  if (!words.length) return [{ t: text, hit: false }];
  const f = fold(text);
  if (f.length !== text.length) return [{ t: text, hit: false }];
  const marks = new Array(text.length).fill(false);
  for (const w of words) {
    let i = f.indexOf(w);
    while (i !== -1) {
      for (let k = i; k < i + w.length; k++) marks[k] = true;
      i = f.indexOf(w, i + w.length);
    }
  }
  const parts: { t: string; hit: boolean }[] = [];
  let cur = "";
  let state = marks[0];
  for (let i = 0; i < text.length; i++) {
    if (marks[i] !== state) {
      parts.push({ t: cur, hit: state });
      cur = "";
      state = marks[i];
    }
    cur += text[i];
  }
  parts.push({ t: cur, hit: state });
  return parts;
}
