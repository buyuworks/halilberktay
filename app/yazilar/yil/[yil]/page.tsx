import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ARTICLES, ARTICLE_SERIES } from "@/data/articles";
import { columnYears } from "@/lib/content";
import { ColumnList, YearIndex } from "@/components/ColumnList";

const MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

export function generateStaticParams() {
  return columnYears().map(([yil]) => ({ yil }));
}

export async function generateMetadata({ params }: { params: Promise<{ yil: string }> }): Promise<Metadata> {
  const { yil } = await params;
  return { title: `${yil} yazıları`, description: `Halil Berktay'ın ${yil} yılında yayımlanan köşe yazıları ve yazı dizileri.` };
}

export default async function YearPage({ params }: { params: Promise<{ yil: string }> }) {
  const { yil } = await params;
  const years = columnYears();
  const i = years.findIndex(([y]) => y === yil);
  if (i < 0) notFound();
  const newer = years[i - 1]?.[0];
  const older = years[i + 1]?.[0];

  const items = ARTICLES.filter((a) => a.kind === "Köşe Yazısı" && a.publishedAt.startsWith(yil)).sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );
  const byMonth = new Map<number, typeof items>();
  for (const a of items) {
    const m = +a.publishedAt.slice(5, 7);
    if (!byMonth.has(m)) byMonth.set(m, []);
    byMonth.get(m)!.push(a);
  }
  const seriesIds = [...new Set(items.map((a) => a.series?.id).filter(Boolean))] as string[];
  const series = seriesIds
    .map((id) => {
      const s = ARTICLE_SERIES.find((x) => x.id === id)!;
      const parts = ARTICLES.filter((a) => a.series?.id === id).sort((a, b) => a.series!.part - b.series!.part);
      return { s, parts };
    })
    .filter((x) => x.s);

  return (
    <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-10 pt-10 sm:pt-14 pb-10">
      <nav className="meta flex flex-wrap items-center gap-2" aria-label="Konum">
        <Link href="/yazilar/" className="hover:text-ink">
          Yazılar
        </Link>
        <span>/</span>
        <span className="text-ink-soft">Yıllar</span>
      </nav>
      <header className="mt-6 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="kicker text-accent">Köşe yazıları</p>
          <h1 className="font-display text-display tracking-[-0.02em] mt-2 tabular-nums">{yil}</h1>
          <p className="meta mt-2">
            {items.length} yazı{series.length ? ` · ${series.length} dizi` : ""}
          </p>
        </div>
        <div className="flex gap-2">
          {older && (
            <Link href={`/yazilar/yil/${older}/`} className="inline-flex items-center gap-1.5 border border-rule px-3 py-2 hover:border-ink-mute">
              <ArrowLeft size={14} /> {older}
            </Link>
          )}
          {newer && (
            <Link href={`/yazilar/yil/${newer}/`} className="inline-flex items-center gap-1.5 border border-rule px-3 py-2 hover:border-ink-mute">
              {newer} <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </header>

      <div className="mt-8">
        <YearIndex counts={[...years].reverse()} current={yil} />
      </div>

      <div className="grid lg:grid-cols-12 gap-14 mt-14">
        <div className="lg:col-span-8 min-w-0">
          {[...byMonth.entries()].map(([m, list]) => (
            <section key={m} className="mb-10" aria-labelledby={`ay-${m}`}>
              <h2 id={`ay-${m}`} className="font-display text-3xl text-ink/30 dark:text-ink/40 leading-none mb-3">
                {MONTHS[m - 1]}
                <span className="meta ml-3 align-middle">{list.length}</span>
              </h2>
              <ColumnList items={list} />
            </section>
          ))}
        </div>
        {series.length > 0 && (
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <p className="kicker text-ink-mute mb-3">Bu yılın dizileri</p>
              <ul className="divide-y divide-rule border-y border-rule">
                {series.map(({ s, parts }) => (
                  <li key={s.id}>
                    <Link href={`/yazilar/${parts[0].slug}/`} className="group flex items-baseline justify-between gap-4 py-3">
                      <span className="font-display text-lg leading-snug link-underline">{s.title}</span>
                      <span className="meta tabular-nums shrink-0">{parts.length} bölüm</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
