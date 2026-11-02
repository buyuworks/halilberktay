import type { Metadata } from "next";
import Link from "next/link";
import { ARTICLES, ARTICLE_SERIES } from "@/data/articles";
import { SOURCES } from "@/data/topics";
import { ColumnList, YearIndex } from "@/components/ColumnList";
import { columnYears } from "@/lib/content";
import type { Source } from "@/lib/types";

export const metadata: Metadata = {
  title: "Yazılar",
  description: "Köşe yazıları, yazı dizileri ve akademik makaleler.",
};

export default function WritingsPage() {
  const columns = ARTICLES.filter((a) => a.kind === "Köşe Yazısı").sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const academic = ARTICLES.filter((a) => a.kind !== "Köşe Yazısı").sort((a, b) => a.publishedAt.localeCompare(b.publishedAt));
  const years = columnYears();

  // Diziler: bölüm listesi, başlangıç tarihi
  const series = ARTICLE_SERIES.map((s) => {
    const parts = ARTICLES.filter((a) => a.series?.id === s.id).sort((a, b) => a.series!.part - b.series!.part);
    const start = parts.reduce((m, a) => (a.publishedAt < m ? a.publishedAt : m), parts[0]?.publishedAt ?? "");
    return { s, parts, start };
  }).filter((x) => x.parts.length > 0);
  // Öne çıkanlar: en uzun diziler (son dizi her zaman başta)
  const featured = [...series].sort((a, b) => b.parts.length - a.parts.length).slice(0, 8);
  const latestSeries = [...series].sort((a, b) => b.start.localeCompare(a.start))[0];
  if (latestSeries && !featured.includes(latestSeries)) featured.splice(7, 1, latestSeries);
  featured.sort((a, b) => b.start.localeCompare(a.start));
  const rest = series.filter((x) => !featured.includes(x)).sort((a, b) => b.start.localeCompare(a.start));

  return (
    <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-10 pt-10 sm:pt-14">
      <header className="max-w-3xl">
        <p className="kicker text-accent">Yazılar</p>
        <h1 className="font-display text-display tracking-[-0.02em] mt-3">Yazılar</h1>
        <p className="mt-5 font-serif text-xl text-ink-soft leading-relaxed">
          Köşe yazıları, yazı dizileri ve akademik makaleler. Diziler bölüm sırasıyla bir arada.
        </p>
      </header>

      {/* Diziler */}
      <section className="mt-16" aria-labelledby="diziler">
        <div className="rule-double pt-4 mb-6 flex items-baseline justify-between">
          <h2 id="diziler" className="kicker text-ink-mute">Yazı dizileri</h2>
          <span className="meta">{series.length} dizi · {series.reduce((n, x) => n + x.parts.length, 0)} bölüm</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-rule border border-rule">
          {featured.map(({ s, parts, start }) => (
            <Link key={s.id} href={`/diziler/${s.id}/`} className="group bg-paper hover:bg-paper-raised p-6 flex flex-col min-h-[15rem]">
              <span className="font-display text-6xl text-accent/80 leading-none tabular-nums">{parts.length}</span>
              <span className="meta mt-1">bölüm · {start.slice(0, 4)}</span>
              <span className="font-display text-2xl leading-tight mt-5 link-underline">{s.title}</span>
              {s.description && <span className="font-serif text-ink-soft text-[0.95rem] mt-3 leading-relaxed line-clamp-3">{s.description}</span>}
            </Link>
          ))}
        </div>
        <details className="group/d mt-6 border-y border-rule">
          <summary className="cursor-pointer list-none flex items-center justify-between py-4 hover:text-accent">
            <span className="font-display text-xl">Tüm diziler ({rest.length} daha)</span>
            <span className="meta group-open/d:hidden">Aç</span>
            <span className="meta hidden group-open/d:inline">Kapat</span>
          </summary>
          <ul className="columns-1 md:columns-2 lg:columns-3 gap-10 pb-6">
            {rest.map(({ s, parts, start }) => (
              <li key={s.id} className="break-inside-avoid py-2 border-b border-rule/70">
                <Link href={`/diziler/${s.id}/`} className="group grid grid-cols-[3rem_1fr_auto] gap-3 items-baseline">
                  <span className="font-mono text-[0.75rem] text-ink-mute">{start.slice(0, 4)}</span>
                  <span className="leading-snug link-underline">{s.title}</span>
                  <span className="meta tabular-nums">{parts.length}</span>
                </Link>
              </li>
            ))}
          </ul>
        </details>
        <Link href="/diziler/" className="inline-block mt-4 text-accent hover:underline">Dizilerin tam listesi →</Link>
      </section>

      <div className="grid lg:grid-cols-12 gap-14 mt-20">
        {/* Köşe yazıları */}
        <section className="lg:col-span-7 min-w-0" aria-labelledby="kose">
          <div className="rule-double pt-4 mb-6 flex items-baseline justify-between">
            <h2 id="kose" className="kicker text-ink-mute">Köşe yazıları</h2>
            <span className="meta">{columns.length} yazı · {years[years.length - 1][0]}–{years[0][0]}</span>
          </div>
          <YearIndex counts={[...years].reverse()} />
          <div className="mt-12">
            <p className="kicker text-ink-mute mb-1">En yeni</p>
            <ColumnList items={columns.slice(0, 24)} showYear />
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              <Link href={`/yazilar/yil/${years[0][0]}/`} className="text-accent hover:underline">
                {years[0][0]} yazılarının tümü →
              </Link>
              <Link href="/arsiv/?tur=Makale" className="text-ink-soft hover:text-accent">
                Arşivde filtrele ve ara →
              </Link>
            </div>
          </div>
          <div className="mt-10 p-6 border border-dashed border-rule">
            <p className="font-display text-xl">Taraf arşivi (2007–2013)</p>
            <p className="text-ink-soft mt-1 text-sm leading-relaxed">
              Taraf yazılarının dijital aktarımı planlanıyor. Kasım 2007 – Mart 2009 arası yazılar{" "}
              <Link href="/kitaplar/weimar-turkiyesi/" className="underline underline-offset-2">Weimar Türkiyesi</Link> ve{" "}
              <Link href="/kitaplar/ozgurluk-dersleri/" className="underline underline-offset-2">Özgürlük Dersleri</Link> kitaplarında derlendi.
            </p>
          </div>
        </section>

        {/* Akademik */}
        <section className="lg:col-span-5 min-w-0">
          <div className="rule-double pt-4 mb-6 flex items-baseline justify-between">
            <h2 className="kicker text-ink-mute">Akademik makaleler ve bölümler</h2>
            <span className="meta">{academic.length}</span>
          </div>
          <ol className="space-y-6">
            {academic.map((a) => (
              <li key={a.id} className="grid grid-cols-[3.5rem_1fr] gap-3">
                <span className="font-mono text-sm text-accent pt-1">{a.publishedAt.slice(0, 4)}</span>
                <Link href={`/yazilar/${a.slug}/`} className="group">
                  <span className="font-display text-[1.1rem] leading-snug link-underline">{a.title}</span>
                  <span className="block font-serif italic text-sm text-ink-mute mt-1">{a.citation}</span>
                </Link>
              </li>
            ))}
          </ol>
          <div className="mt-12">
            <p className="kicker text-ink-mute mb-3">Mecralar</p>
            <ul className="divide-y divide-rule border-y border-rule">
              {(Object.keys(SOURCES) as Source[]).map((s) => (
                <li key={s}>
                  <Link href={`/arsiv/?kaynak=${encodeURIComponent(s)}`} className="flex justify-between gap-4 py-2.5 hover:text-accent">
                    <span>{s}</span>
                    <span className="meta">{SOURCES[s].years}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
