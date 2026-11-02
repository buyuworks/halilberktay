import type { Metadata } from "next";
import Link from "next/link";
import { ARTICLES, ARTICLE_SERIES } from "@/data/articles";
import { SOURCES } from "@/data/topics";
import { formatDateShort } from "@/lib/format";
import type { Source } from "@/lib/types";

export const metadata: Metadata = {
  title: "Yazılar",
  description: "Köşe yazıları, yazı dizileri ve akademik makaleler.",
};

export default function WritingsPage() {
  const columns = ARTICLES.filter((a) => a.kind === "Köşe Yazısı").sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const academic = ARTICLES.filter((a) => a.kind !== "Köşe Yazısı").sort((a, b) => a.publishedAt.localeCompare(b.publishedAt));
  const byYear = columns.reduce<Record<string, typeof columns>>((m, a) => {
    (m[a.publishedAt.slice(0, 4)] ??= []).push(a);
    return m;
  }, {});

  return (
    <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-10 pt-10 sm:pt-14">
      <header className="max-w-3xl">
        <p className="kicker text-accent">Yazılar</p>
        <h1 className="font-display text-display tracking-[-0.02em] mt-3">Köşe ve kürsü</h1>
        <p className="mt-5 font-serif text-xl text-ink-soft leading-relaxed">
          Toplum ve Bilim&apos;deki ilk makalelerden Taraf ve Serbestiyet köşelerine, kırk yılı aşkın bir yazı serüveni.
          Berktay sık sık numaralı diziler hâlinde yazar; diziler burada tek bir okuma rotası olarak toplanır.
        </p>
      </header>

      {/* Diziler */}
      <section className="mt-16">
        <div className="rule-double pt-4 mb-6 flex items-baseline justify-between">
          <h2 className="kicker text-ink-mute">Yazı dizileri</h2>
          <span className="meta">{ARTICLE_SERIES.length} dizi</span>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-rule border border-rule">
          {ARTICLE_SERIES.map((s) => {
            const parts = ARTICLES.filter((a) => a.series?.id === s.id).sort((a, b) => a.series!.part - b.series!.part);
            return (
              <Link key={s.id} href={`/yazilar/${parts[0].slug}/`} className="group bg-paper hover:bg-paper-raised p-6 flex flex-col min-h-[16rem]">
                <span className="font-display text-6xl text-accent/80 leading-none tabular-nums">{parts.length}</span>
                <span className="meta mt-1">bölüm · {parts[0].publishedAt.slice(0, 4)}</span>
                <span className="font-display text-2xl leading-tight mt-5 link-underline">{s.title}</span>
                <span className="font-serif text-ink-soft text-[0.95rem] mt-3 leading-relaxed line-clamp-3">{s.description}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="grid lg:grid-cols-12 gap-14 mt-20">
        {/* Köşe yazıları */}
        <section className="lg:col-span-7">
          <div className="rule-double pt-4 mb-2 flex items-baseline justify-between">
            <h2 className="kicker text-ink-mute">Köşe yazıları</h2>
            <span className="meta">{columns.length} yazı yüklü · 1000+ aktarılıyor</span>
          </div>
          {Object.entries(byYear)
            .sort((a, b) => b[0].localeCompare(a[0]))
            .map(([y, list]) => (
              <div key={y} className="mt-8">
                <p className="font-display text-5xl text-ink/15 dark:text-ink/25 leading-none">{y}</p>
                <ul className="mt-3 border-t border-rule">
                  {list.map((a) => (
                    <li key={a.id} className="border-b border-rule">
                      <Link href={`/yazilar/${a.slug}/`} className="group grid grid-cols-[5.5rem_1fr] gap-4 py-3.5">
                        <span className="meta pt-1">{formatDateShort(a.publishedAt).slice(0, 6)}</span>
                        <span>
                          <span className="font-display text-[1.15rem] leading-snug link-underline">{a.title}</span>
                          <span className="meta block mt-0.5">
                            {a.source}
                            {a.series ? ` · dizi ${a.series.part}` : ""}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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
        <section className="lg:col-span-5">
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
            <dl className="divide-y divide-rule border-y border-rule">
              {(Object.keys(SOURCES) as Source[]).map((s) => (
                <Link key={s} href={`/arsiv/?kaynak=${encodeURIComponent(s)}`} className="flex justify-between gap-4 py-2.5 hover:text-accent">
                  <dt>{s}</dt>
                  <dd className="meta">{SOURCES[s].years}</dd>
                </Link>
              ))}
            </dl>
          </div>
        </section>
      </div>
    </div>
  );
}
