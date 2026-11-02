import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { TOPICS, TOPIC_IDS } from "@/data/topics";
import { ARTICLES, ARTICLE_SERIES } from "@/data/articles";
import { BOOKS } from "@/data/books";
import { VIDEOS } from "@/data/videos";
import { ColumnList } from "@/components/ColumnList";
import { BookCover } from "@/components/BookCover";
import type { TopicId } from "@/lib/types";

export function generateStaticParams() {
  return TOPIC_IDS.map((konu) => ({ konu }));
}

export async function generateMetadata({ params }: { params: Promise<{ konu: string }> }): Promise<Metadata> {
  const { konu } = await params;
  const t = TOPICS[konu as TopicId];
  return t ? { title: t.label, description: t.description } : {};
}

export default async function TopicPage({ params }: { params: Promise<{ konu: string }> }) {
  const { konu } = await params;
  const id = konu as TopicId;
  const t = TOPICS[id];
  if (!t) notFound();

  const arts = ARTICLES.filter((a) => a.tags.includes(id)).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const academic = arts.filter((a) => a.kind !== "Köşe Yazısı");
  const columns = arts.filter((a) => a.kind === "Köşe Yazısı");
  const books = BOOKS.filter((b) => b.tags.includes(id)).sort((a, b) => a.year - b.year);
  const videos = VIDEOS.filter((v) => v.tags.includes(id));

  // Bu konuda en çok bölümü olan diziler
  const seriesCount = new Map<string, number>();
  for (const a of columns) if (a.series) seriesCount.set(a.series.id, (seriesCount.get(a.series.id) ?? 0) + 1);
  const series = [...seriesCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([sid]) => {
      const s = ARTICLE_SERIES.find((x) => x.id === sid)!;
      const parts = ARTICLES.filter((a) => a.series?.id === sid).sort((a, b) => a.series!.part - b.series!.part);
      return { s, parts };
    });

  // Yıllara dağılım
  const years = new Map<number, number>();
  for (const a of arts) years.set(+a.publishedAt.slice(0, 4), (years.get(+a.publishedAt.slice(0, 4)) ?? 0) + 1);
  const yMin = Math.min(...years.keys(), ...books.map((b) => b.year));
  const yMax = Math.max(...years.keys());
  const max = Math.max(...years.values());

  const others = TOPIC_IDS.filter((x) => x !== id);

  return (
    <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-10 pt-10 sm:pt-14 pb-10">
      <nav className="meta flex flex-wrap items-center gap-2" aria-label="Konum">
        <Link href="/arsiv/" className="hover:text-ink">
          Arşiv
        </Link>
        <span>/</span>
        <span className="text-ink-soft">Konular</span>
      </nav>

      <header className="mt-6 grid lg:grid-cols-12 gap-8 items-end">
        <div className="lg:col-span-7">
          <p className="kicker text-accent">Konu</p>
          <h1 className="font-display text-display tracking-[-0.02em] mt-2">{t.label}</h1>
          <p className="mt-4 font-serif text-xl text-ink-soft leading-relaxed max-w-2xl">{t.description}</p>
        </div>
        <dl className="lg:col-span-5 grid grid-cols-4 border-y border-rule divide-x divide-rule text-center">
          {[
            ["Yazı", columns.length],
            ["Akademik", academic.length],
            ["Kitap", books.length],
            ["Video", videos.length],
          ].map(([k, v]) => (
            <div key={k} className="py-4">
              <dd className="font-display text-3xl tabular-nums">{v}</dd>
              <dt className="meta mt-1">{k}</dt>
            </div>
          ))}
        </dl>
      </header>

      {/* Zaman içinde yoğunluk */}
      {years.size > 1 && (
        <figure className="mt-12" aria-label={`${t.label} konusundaki yazıların yıllara dağılımı`}>
          <div className="flex items-end gap-[2px] h-20 border-b border-rule">
            {Array.from({ length: yMax - yMin + 1 }, (_, i) => yMin + i).map((y) => {
              const n = years.get(y) ?? 0;
              return (
                <div
                  key={y}
                  title={`${y}: ${n}`}
                  className={n ? "flex-1 bg-accent/70" : "flex-1 bg-transparent"}
                  style={{ height: `${n ? Math.max(4, (n / max) * 100) : 0}%` }}
                />
              );
            })}
          </div>
          <figcaption className="flex justify-between meta mt-1.5">
            <span>{yMin}</span>
            <span>Yıllara göre yazı ve makale sayısı</span>
            <span>{yMax}</span>
          </figcaption>
        </figure>
      )}

      <div className="grid lg:grid-cols-12 gap-14 mt-14">
        <div className="lg:col-span-8 min-w-0">
          {series.length > 0 && (
            <section className="mb-14" aria-labelledby="k-diziler">
              <h2 id="k-diziler" className="kicker text-ink-mute rule-double pt-4 mb-4">
                Bu konudaki yazı dizileri
              </h2>
              <ul className="grid sm:grid-cols-2 gap-px bg-rule border border-rule">
                {series.map(({ s, parts }, i) => (
                  <li key={s.id} className={`bg-paper ${i === series.length - 1 && series.length % 2 ? "sm:col-span-2" : ""}`}>
                    <Link href={`/diziler/${s.id}/`} className="group block p-5 hover:bg-paper-raised h-full">
                      <span className="meta">
                        {parts.length} bölüm · {parts[0].publishedAt.slice(0, 4)}
                      </span>
                      <span className="block font-display text-xl leading-snug mt-1.5 link-underline">{s.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section aria-labelledby="k-yazilar">
            <div className="rule-double pt-4 mb-2 flex items-baseline justify-between">
              <h2 id="k-yazilar" className="kicker text-ink-mute">Son yazılar</h2>
              <span className="meta">{columns.length > 30 ? `${columns.length} yazının en yeni 30'u` : `${columns.length} yazı`}</span>
            </div>
            <ColumnList items={columns.slice(0, 30)} showYear />
            <Link
              href={`/arsiv/?konu=${id}`}
              className="mt-6 inline-flex items-center gap-2 bg-ink text-paper px-4 py-2.5 hover:bg-accent transition-colors"
            >
              Tümünü arşivde filtrele <ArrowRight size={16} />
            </Link>
          </section>
        </div>

        <aside className="lg:col-span-4 space-y-12">
          {academic.length > 0 && (
            <section aria-labelledby="k-akademik">
              <h2 id="k-akademik" className="kicker text-ink-mute mb-3">
                Akademik metinler
              </h2>
              <ol className="space-y-4">
                {academic.map((a) => (
                  <li key={a.id} className="grid grid-cols-[3rem_1fr] gap-2">
                    <span className="font-mono text-sm text-accent pt-0.5">{a.publishedAt.slice(0, 4)}</span>
                    <Link href={`/yazilar/${a.slug}/`} className="leading-snug hover:text-accent">
                      {a.title}
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          )}
          {books.length > 0 && (
            <section aria-labelledby="k-kitaplar">
              <h2 id="k-kitaplar" className="kicker text-ink-mute mb-3">
                Kitaplar
              </h2>
              <ul className="grid grid-cols-2 gap-4">
                {books.map((b) => (
                  <li key={b.id}>
                    <Link href={`/kitaplar/${b.slug}/`} className="block group" title={b.title}>
                      <BookCover book={b} size="sm" />
                      <span className="meta block mt-1.5">{b.year}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <section aria-labelledby="k-diger">
            <h2 id="k-diger" className="kicker text-ink-mute mb-3">
              Diğer konular
            </h2>
            <ul className="flex flex-wrap gap-x-4 gap-y-2">
              {others.map((o) => (
                <li key={o}>
                  <Link href={`/konular/${o}/`} className="link-underline text-ink-soft hover:text-ink">
                    {TOPICS[o].label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
