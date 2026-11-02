import type { MetadataRoute } from "next";
import { ARTICLES } from "@/data/articles";
import { BOOKS } from "@/data/books";
import { VIDEOS } from "@/data/videos";
import { TOPIC_IDS } from "@/data/topics";
import { allSeries, columnYears } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (p: string) => `${SITE_URL}${p}`;
  const fixed = ["/", "/arsiv/", "/yazilar/", "/diziler/", "/kitaplar/", "/videolar/", "/radar/", "/biyografi/", "/hakkinda/"];
  return [
    ...fixed.map((p) => ({ url: u(p) })),
    ...ARTICLES.map((a) => ({ url: u(`/yazilar/${a.slug}/`), lastModified: a.publishedAt.length === 10 ? a.publishedAt : undefined })),
    ...allSeries().map(({ s }) => ({ url: u(`/diziler/${s.id}/`) })),
    ...columnYears().map(([y]) => ({ url: u(`/yazilar/yil/${y}/`) })),
    ...TOPIC_IDS.map((t) => ({ url: u(`/konular/${t}/`) })),
    ...BOOKS.map((b) => ({ url: u(`/kitaplar/${b.slug}/`) })),
    ...VIDEOS.map((v) => ({ url: u(`/videolar/${v.slug}/`) })),
  ];
}
