import { ARTICLES, ARTICLE_SERIES } from "@/data/articles";
import { BOOKS } from "@/data/books";
import { VIDEOS, VIDEO_SERIES } from "@/data/videos";
import { RADAR } from "@/data/radar";
import { TOPICS } from "@/data/topics";
import type { Article, Book, ContentType, RadarItem, TopicId, Video } from "@/lib/types";

/* ------------------------------------------------------------------
   BİRLEŞİK İNDEKS
   Makale, video, ses, kitap ve radar kayıtlarını aynı arama/filtre
   motorunda kullanmak için ortak bir "ArchiveEntry" biçimine çevirir.
   Statik derlemede bir kez üretilir; istemciye JSON olarak iner (~birkaç KB).
   1000+ yazıda: Pagefind veya Typesense/Meilisearch'e geçilir.
------------------------------------------------------------------- */

export interface ArchiveEntry {
  id: string;
  type: ContentType;
  title: string;
  summary: string;
  href: string;
  external?: string;
  date: string;
  year: number;
  datePrecision?: "day" | "month" | "year";
  source: string; // mecra / seri / yayınevi
  tags: TopicId[];
  readingTime?: number;
  seriesLabel?: string;
  part?: number;
  /** Görüntülenecek bölüm etiketi (ör. "14b") */
  partLabel?: string;
  lang?: "en";
  /** Yorum metni örnektir (Radar prototip notları) */
  sample?: boolean;
  youtubeId?: string | null;
  kind?: string;
  citation?: string;
}

export const articleHref = (a: Article) => `/yazilar/${a.slug}/`;
export const bookHref = (b: Book) => `/kitaplar/${b.slug}/`;
export const videoHref = (v: Video) => `/videolar/${v.slug}/`;

export function seriesTitle(id: string) {
  return ARTICLE_SERIES.find((s) => s.id === id)?.title ?? VIDEO_SERIES.find((s) => s.id === id)?.title ?? id;
}

export function buildIndex(): ArchiveEntry[] {
  const a: ArchiveEntry[] = ARTICLES.map((x) => ({
    id: x.id,
    type: "Makale",
    title: x.title,
    summary: x.summary,
    href: articleHref(x),
    external: x.externalUrl,
    date: x.publishedAt,
    year: +x.publishedAt.slice(0, 4),
    datePrecision: x.datePrecision,
    source: x.source,
    tags: x.tags,
    readingTime: x.readingTime,
    seriesLabel: x.series ? seriesTitle(x.series.id) : undefined,
    part: x.series?.part,
    partLabel: x.series ? (x.series.label ?? String(x.series.part)) : undefined,
    lang: x.language,
    kind: x.kind,
    citation: x.citation,
  }));
  const v: ArchiveEntry[] = VIDEOS.map((x) => ({
    id: x.id,
    type: x.medium === "Ses Kaydı" ? "Ses Kaydı" : "Video",
    title: x.title,
    summary: x.summary,
    href: videoHref(x),
    external: x.sourceUrl,
    date: x.publishedAt,
    year: +x.publishedAt.slice(0, 4),
    source: seriesTitle(x.series),
    tags: x.tags,
    seriesLabel: seriesTitle(x.series),
    part: x.part,
    youtubeId: x.youtubeId,
  }));
  const b: ArchiveEntry[] = BOOKS.map((x) => ({
    id: x.id,
    type: "Kitap",
    title: x.subtitle ? `${x.title}: ${x.subtitle}` : x.title,
    summary: x.description,
    href: bookHref(x),
    date: `${x.year}-01-01`,
    year: x.year,
    datePrecision: "year",
    source: x.publisher,
    tags: x.tags,
    kind: x.role,
  }));
  const r: ArchiveEntry[] = RADAR.map((x: RadarItem) => ({
    id: x.id,
    type: "Radar",
    title: x.itemTitle,
    summary: x.berktayComment,
    href: `/radar/#${x.id}`,
    external: x.externalUrl,
    date: x.date,
    year: +x.date.slice(0, 4),
    source: x.author ? `${x.author} · ${x.itemSource}` : x.itemSource,
    tags: x.tags ?? [],
    kind: x.category,
    sample: x.placeholder || undefined,
  }));
  return [...a, ...v, ...b, ...r].sort((p, q) => q.date.localeCompare(p.date));
}

export function relatedArticles(article: Article, n = 4): Article[] {
  return ARTICLES.filter((x) => x.id !== article.id)
    .map((x) => {
      let score = x.tags.filter((t) => article.tags.includes(t)).length * 2;
      if (x.series && article.series && x.series.id === article.series.id) score += 3;
      if (x.source === article.source) score += 0.5;
      const dt = Math.abs(+new Date(x.publishedAt) - +new Date(article.publishedAt)) / 8.64e7 / 365;
      score -= Math.min(dt, 10) * 0.15;
      return { x, score };
    })
    .sort((p, q) => q.score - p.score)
    .slice(0, n)
    .map((p) => p.x);
}

export function topicCounts() {
  const idx = buildIndex();
  return (Object.keys(TOPICS) as TopicId[])
    .map((t) => ({ id: t, count: idx.filter((e) => e.tags.includes(t)).length }))
    .sort((a, b) => b.count - a.count);
}

export const STATS = {
  articles: ARTICLES.length,
  columns: ARTICLES.filter((a) => a.kind === "Köşe Yazısı").length,
  academic: ARTICLES.filter((a) => a.kind !== "Köşe Yazısı").length,
  books: BOOKS.length,
  videos: VIDEOS.length,
};

/** Köşe yazılarının yıllara dağılımı, yeniden eskiye: [yıl, sayı][] */
export function columnYears(): [string, number][] {
  const m = new Map<string, number>();
  for (const a of ARTICLES) if (a.kind === "Köşe Yazısı") m.set(a.publishedAt.slice(0, 4), (m.get(a.publishedAt.slice(0, 4)) ?? 0) + 1);
  return [...m.entries()].sort((a, b) => b[0].localeCompare(a[0]));
}

/** Dizi içinde tekrarlanan "Dizi adı (n)" önekini atar */
export function shortTitle(a: Article) {
  if (!a.series) return a.title;
  const t = a.title.replace(/^.*?\(\s*\d+[ab]?\s*\)\s*[:–-]?\s*/, "").replace(/^\d+[ab]?\s*[:–-]\s*/, "");
  if (t.length <= 2 || t === a.title) return a.title;
  return t.charAt(0).toLocaleUpperCase("tr") + t.slice(1);
}

export const partLabel = (a: Article) => a.series?.label ?? String(a.series?.part ?? "");
export const seriesHref = (id: string) => `/diziler/${id}/`;

/** Tüm yazı dizileri: bölümler sıralı, başlangıç/bitiş tarihi */
export function allSeries() {
  return ARTICLE_SERIES.map((s) => {
    const parts = ARTICLES.filter((a) => a.series?.id === s.id).sort((a, b) => a.series!.part - b.series!.part);
    const dates = parts.map((a) => a.publishedAt).sort();
    return { s, parts, start: dates[0] ?? "", end: dates[dates.length - 1] ?? "" };
  }).filter((x) => x.parts.length > 0);
}
