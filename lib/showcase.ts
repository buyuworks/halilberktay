import type { ArchiveEntry } from "@/lib/content";
import type { ContentType, TopicId } from "@/lib/types";

/* Ana sayfa vitrini: sabitler ve sunucu tarafı alt küme seçimi.
   Tam dizin (~900 kayıt) yerine her tür × konu kesişiminden yalnızca
   gösterilebilecek kadar kayıt istemciye gönderilir. */
export const SHOWCASE_TYPES: ("Tümü" | ContentType)[] = ["Tümü", "Makale", "Video", "Ses Kaydı", "Kitap"];
export const SHOWCASE_TOPICS: TopicId[] = [
  "erken-cumhuriyet",
  "osmanli-iktisat",
  "solun-tarihi",
  "devrimler",
  "guncel-siyaset",
  "feodalizm-atut",
  "somurgecilik",
  "tarih-yazimi",
];

export function showcaseData(index: ArchiveEntry[], perCell = 9) {
  const pool = index.filter((e) => e.type !== "Radar");
  const pick = new Map<string, ArchiveEntry>();
  const counts: Record<string, number> = {};
  for (const t of SHOWCASE_TYPES) {
    for (const topic of [null, ...SHOWCASE_TOPICS]) {
      const cell = pool.filter((e) => (t === "Tümü" || e.type === t) && (!topic || e.tags.includes(topic)));
      counts[`${t}|${topic ?? ""}`] = cell.length;
      cell.slice(0, perCell).forEach((e) => pick.set(e.id, e));
    }
  }
  // "Tümü" karışık görünümü için her dizi/tür grubundan birkaç kayıt daha
  const groups = new Map<string, number>();
  for (const e of pool) {
    const k = e.type === "Makale" ? `${e.kind}|${e.seriesLabel ?? ""}` : e.type;
    const n = groups.get(k) ?? 0;
    if (n < 1) pick.set(e.id, e);
    groups.set(k, n + 1);
  }
  const entries = pool
    .filter((e) => pick.has(e.id))
    .map(({ citation, external, ...rest }) => ({
      ...rest,
      summary: rest.summary.length > 170 ? rest.summary.slice(0, 167).replace(/\s+\S*$/, "") + "…" : rest.summary,
    }));
  return { entries, counts };
}
