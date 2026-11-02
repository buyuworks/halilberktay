import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { allSeries, partLabel, seriesHref, shortTitle } from "@/lib/content";
import { formatDate, formatDateShort } from "@/lib/format";
import { TopicTag } from "@/components/EntryViews";
import type { TopicId } from "@/lib/types";

export function generateStaticParams() {
  return allSeries().map(({ s }) => ({ dizi: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ dizi: string }> }): Promise<Metadata> {
  const { dizi } = await params;
  const x = allSeries().find((y) => y.s.id === dizi);
  return x ? { title: `${x.s.title} (yazı dizisi)`, description: x.s.description || `Halil Berktay'ın ${x.parts.length} bölümlük yazı dizisi.` } : {};
}

export default async function SeriesPage({ params }: { params: Promise<{ dizi: string }> }) {
  const { dizi } = await params;
  const list = allSeries().sort((a, b) => a.start.localeCompare(b.start));
  const i = list.findIndex((y) => y.s.id === dizi);
  if (i < 0) notFound();
  const { s, parts, start, end } = list[i];
  const minutes = parts.reduce((n, a) => n + (a.readingTime ?? 0), 0);
  const tagCount = new Map<TopicId, number>();
  for (const a of parts) for (const t of a.tags) tagCount.set(t, (tagCount.get(t) ?? 0) + 1);
  const tags = [...tagCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([t]) => t);
  const sources = [...new Set(parts.map((a) => a.source))];
  const range = start.slice(0, 7) === end.slice(0, 7) ? formatDate(start, "month") : `${formatDate(start, "month")} – ${formatDate(end, "month")}`;
  const older = list[i - 1];
  const newer = list[i + 1];

  return (
    <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-10 pt-10 sm:pt-14 pb-10">
      <nav className="meta flex flex-wrap items-center gap-2" aria-label="Konum">
        <Link href="/yazilar/" className="hover:text-ink">Yazılar</Link>
        <span>/</span>
        <Link href="/diziler/" className="hover:text-ink">Diziler</Link>
      </nav>

      <header className="mt-6 grid lg:grid-cols-12 gap-8 items-end">
        <div className="lg:col-span-8 min-w-0">
          <p className="kicker text-accent">Yazı dizisi · {sources.join(", ")}</p>
          <h1 className="font-display text-display tracking-[-0.02em] mt-2">{s.title}</h1>
          {s.description && <p className="mt-4 font-serif text-xl text-ink-soft leading-relaxed max-w-2xl">{s.description}</p>}
          {tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {tags.map((t) => <TopicTag key={t} id={t} />)}
            </div>
          )}
        </div>
        <div className="lg:col-span-4">
          <dl className="grid grid-cols-2 border-y border-rule divide-x divide-rule text-center">
            <div className="py-4">
              <dd className="font-display text-3xl tabular-nums">{parts.length}</dd>
              <dt className="meta mt-1">bölüm</dt>
            </div>
            <div className="py-4">
              <dd className="font-display text-3xl tabular-nums">~{Math.max(1, Math.round(minutes / 5) * 5)}</dd>
              <dt className="meta mt-1">dk okuma (tahmini)</dt>
            </div>
          </dl>
          <p className="meta mt-3 text-center">{range}</p>
          <Link
            href={`/yazilar/${parts[0].slug}/`}
            className="mt-4 flex items-center justify-center gap-2 bg-ink text-paper px-5 py-3 hover:bg-accent transition-colors"
          >
            Baştan okumaya başla <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </header>

      <section className="mt-14 max-w-4xl" aria-labelledby="bolumler">
        <div className="rule-double pt-4 mb-2 flex items-baseline justify-between">
          <h2 id="bolumler" className="kicker text-ink-mute">Bölümler</h2>
          <span className="meta">{parts.length}</span>
        </div>
        <ol className="border-t border-rule">
          {parts.map((a) => (
            <li key={a.id} className="border-b border-rule">
              <Link href={`/yazilar/${a.slug}/`} className="group grid grid-cols-[3rem_1fr] sm:grid-cols-[4rem_1fr_7rem] gap-x-4 py-5">
                <span className="font-display text-3xl text-accent/80 leading-none tabular-nums">{partLabel(a)}</span>
                <span className="min-w-0">
                  <span lang={a.language} className="font-display text-[1.3rem] leading-snug link-underline">{shortTitle(a)}</span>
                  {a.summary && <span className="block font-serif text-ink-soft mt-1.5 leading-relaxed">{a.summary}</span>}
                  <span className="meta block mt-1.5 sm:hidden">{formatDateShort(a.publishedAt, a.datePrecision)}</span>
                </span>
                <span className="meta hidden sm:block text-right pt-1">{formatDateShort(a.publishedAt, a.datePrecision)}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <nav className="mt-14 grid sm:grid-cols-2 gap-px bg-rule border border-rule" aria-label="Diğer diziler">
        {older ? (
          <Link href={seriesHref(older.s.id)} className="group bg-paper hover:bg-paper-raised p-6">
            <span className="meta">← Önceki dizi · {older.start.slice(0, 4)}</span>
            <span className="block font-display text-xl mt-2 link-underline">{older.s.title}</span>
          </Link>
        ) : <span className="bg-paper" />}
        {newer ? (
          <Link href={seriesHref(newer.s.id)} className="group bg-paper hover:bg-paper-raised p-6 sm:text-right">
            <span className="meta">Sonraki dizi · {newer.start.slice(0, 4)} →</span>
            <span className="block font-display text-xl mt-2 link-underline">{newer.s.title}</span>
          </Link>
        ) : <span className="bg-paper" />}
      </nav>
    </div>
  );
}
