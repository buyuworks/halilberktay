import type { Metadata } from "next";
import Link from "next/link";
import { allSeries, seriesHref } from "@/lib/content";

export const metadata: Metadata = {
  title: "Yazı dizileri",
  description: "Halil Berktay'ın numaralı yazı dizileri, bölüm sırasıyla.",
};

export default function SeriesIndexPage() {
  const list = allSeries().sort((a, b) => b.start.localeCompare(a.start));
  const byYear = new Map<string, typeof list>();
  for (const x of list) {
    const y = x.start.slice(0, 4);
    byYear.set(y, [...(byYear.get(y) ?? []), x]);
  }
  const total = list.reduce((n, x) => n + x.parts.length, 0);

  return (
    <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-10 pt-10 sm:pt-14 pb-10">
      <nav className="meta flex flex-wrap items-center gap-2" aria-label="Konum">
        <Link href="/yazilar/" className="hover:text-ink">Yazılar</Link>
        <span>/</span>
        <span className="text-ink-soft">Diziler</span>
      </nav>
      <header className="mt-6 max-w-3xl">
        <p className="kicker text-accent">Yazı dizileri</p>
        <h1 className="font-display text-display tracking-[-0.02em] mt-2">Bölüm bölüm</h1>
        <p className="mt-4 font-serif text-xl text-ink-soft leading-relaxed">
          Berktay bir konuyu çoğu zaman tek yazıda değil, numaralı bir dizide işler. {list.length} dizi, toplam {total} bölüm;
          her biri baştan sona okunabilecek bir rota.
        </p>
      </header>

      <div className="mt-12 space-y-12">
        {[...byYear.entries()].map(([y, xs]) => (
          <section key={y} className="grid md:grid-cols-[6rem_1fr] gap-4 md:gap-8" aria-labelledby={`y${y}`}>
            <h2 id={`y${y}`} className="font-mono text-accent text-lg md:pt-4 md:sticky md:top-24 self-start">{y}</h2>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 pt-px pl-px min-w-0">
              {xs.map(({ s, parts }) => (
                <li key={s.id} className="border border-rule -mt-px -ml-px">
                  <Link href={seriesHref(s.id)} className="group flex flex-col h-full p-5 hover:bg-paper-raised">
                    <span className="flex items-baseline gap-2">
                      <span className="font-display text-3xl text-accent/80 tabular-nums leading-none">{parts.length}</span>
                      <span className="meta">bölüm · {parts[0].source}</span>
                    </span>
                    <span className="font-display text-xl leading-tight mt-3 link-underline">{s.title}</span>
                    {s.description && <span className="font-serif text-ink-soft text-[0.95rem] mt-2 leading-relaxed line-clamp-3">{s.description}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
