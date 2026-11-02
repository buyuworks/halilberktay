import { ARTICLES } from "@/data/articles";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Son 50 yazının RSS akışı */
export function GET() {
  const items = [...ARTICLES]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 50)
    .map((a) => {
      const link = `${SITE_URL}/yazilar/${a.slug}/`;
      const d = new Date(a.publishedAt.length === 7 ? `${a.publishedAt}-01` : a.publishedAt);
      return `<item><title>${esc(a.title)}</title><link>${link}</link><guid>${link}</guid><pubDate>${d.toUTCString()}</pubDate><description>${esc(a.summary ?? "")}</description><category>${esc(a.source)}</category></item>`;
    })
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Halil Berktay · Yazılar</title><link>${SITE_URL}/</link><description>Halil Berktay'ın köşe yazıları ve makaleleri</description><language>tr</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
