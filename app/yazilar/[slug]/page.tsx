import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { ARTICLES, ARTICLE_SERIES } from "@/data/articles";
import { relatedArticles, shortTitle, partLabel, seriesHref } from "@/lib/content";
import { formatDate, formatDateShort, cx } from "@/lib/format";
import { ReadingProgress, ReaderControls, TableOfContents, CopyCitation } from "@/components/ReaderTools";
import { TopicTag } from "@/components/EntryViews";
import type { Article } from "@/lib/types";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = ARTICLES.find((x) => x.slug === slug);
  if (!a) return {};
  return {
    title: a.title,
    description: a.summary || `${a.title}. Halil Berktay, ${a.source}, ${formatDate(a.publishedAt, a.datePrecision)}.`,
    openGraph: { type: "article", publishedTime: a.publishedAt, authors: ["Halil Berktay"] },
  };
}

const pl = partLabel;

function citationFor(a: Article) {
  const date = formatDate(a.publishedAt, a.datePrecision);
  if (a.citation) return `Berktay, Halil. "${a.title}." ${a.citation}`;
  return `Berktay, Halil. "${a.title}." ${a.source}, ${date}.${a.externalUrl ? ` ${a.externalUrl}` : ""}`;
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = ARTICLES.find((x) => x.slug === slug);
  if (!a) notFound();

  const series = a.series ? ARTICLE_SERIES.find((s) => s.id === a.series!.id) : undefined;
  const siblings = series
    ? ARTICLES.filter((x) => x.series?.id === series.id).sort((p, q) => p.series!.part - q.series!.part)
    : [];
  const idx = siblings.findIndex((x) => x.id === a.id);
  const prev = idx > 0 ? siblings[idx - 1] : undefined;
  const next = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : undefined;
  const related = relatedArticles(a, 30).filter((r) => !siblings.some((s) => s.id === r.id));
  const toc = (a.content ?? []).filter((b) => b.type === "h2") as { type: "h2"; text: string; id: string }[];

  // Schema.org yapılandırılmış veri (SEO)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": a.kind === "Köşe Yazısı" ? "OpinionNewsArticle" : "ScholarlyArticle",
    headline: a.title,
    abstract: a.summary || undefined,
    datePublished: a.publishedAt,
    author: { "@type": "Person", name: "Halil Berktay" },
    publisher: { "@type": "Organization", name: a.source },
    isPartOf: series ? { "@type": "CreativeWorkSeries", name: series.title } : undefined,
    url: a.externalUrl,
  };

  return (
    <article id="makale" className="pb-10">
      <ReadingProgress targetId="makale" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Başlık bloğu */}
      <header className="mx-auto max-w-page px-4 sm:px-6 lg:px-10 pt-10 sm:pt-16">
        <nav className="meta flex flex-wrap items-center gap-2" aria-label="Konum">
          <Link href="/yazilar/" className="hover:text-ink">
            Yazılar
          </Link>
          <span>/</span>
          <Link href={`/arsiv/?kaynak=${encodeURIComponent(a.source)}`} className="hover:text-ink">
            {a.source}
          </Link>
          {series && (
            <>
              <span>/</span>
              <Link href={seriesHref(series.id)} className="text-ink-soft hover:text-ink">{series.title}</Link>
            </>
          )}
        </nav>

        <div className="max-w-4xl mt-8">
          <p className="kicker text-accent">
            {a.kind}
            {series ? ` · Dizi, ${pl(a)}. bölüm` : ""}
          </p>
          <h1 lang={a.language} className="font-display text-[2.4rem] sm:text-[3.6rem] lg:text-[4.2rem] leading-[1.03] tracking-[-0.02em] mt-4" style={{ textWrap: "balance" } as React.CSSProperties}>
            {a.title}
          </h1>
          {a.summary && <p className="mt-6 font-display italic text-[1.35rem] sm:text-[1.6rem] leading-snug text-ink-soft max-w-3xl">{a.summary}</p>}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 py-3 border-y border-rule">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <span className="font-medium">Halil Berktay</span>
            <span className="meta">{formatDate(a.publishedAt, a.datePrecision)}</span>
            <span className="meta">{a.readingTime} dk okuma{a.content ? "" : " (tahmini)"}</span>
            <span className="meta">{a.source}</span>
            {a.language === "en" && <span className="meta">İngilizce</span>}
          </div>
          <ReaderControls />
        </div>
      </header>

      {/* Gövde */}
      <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-10 mt-12 grid lg:grid-cols-12 gap-10">
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-28 space-y-10">
            {toc.length > 0 && <TableOfContents items={toc} />}
            {series && (
              <nav aria-label="Dizideki yazılar">
                <p className="kicker text-ink-mute mb-1">Dizi</p>
                <Link href={seriesHref(series.id)} className="block font-display text-lg leading-snug mb-3 hover:text-accent">{series.title}</Link>
                <ol className="space-y-1.5 max-h-[50vh] overflow-y-auto pr-2 scrollbar-none">
                  {siblings.map((s) => (
                    <li key={s.id}>
                      <Link
                        href={`/yazilar/${s.slug}/`}
                        aria-current={s.id === a.id ? "page" : undefined}
                        className={cx(
                          "flex gap-2 text-sm leading-snug",
                          s.id === a.id ? "text-accent" : "text-ink-mute hover:text-ink",
                        )}
                      >
                        <span className="font-mono text-[0.7rem] pt-0.5 w-7 shrink-0">{pl(s)}</span>
                        <span>{shortTitle(s)}</span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
          </div>
        </aside>

        <div className="lg:col-span-6 min-w-0">
          {a.content ? (
            <div className="prose-berktay">
              {a.content.map((b, i) =>
                b.type === "h2" ? (
                  <h2 key={i} id={b.id}>
                    {b.text}
                  </h2>
                ) : b.type === "quote" ? (
                  <blockquote key={i}>{b.text}</blockquote>
                ) : (
                  <p key={i} className={i === 0 ? "dropcap" : undefined}>
                    {b.text}
                  </p>
                ),
              )}
            </div>
          ) : (
            <>
            {a.summary && (
              <div className="prose-berktay mb-10">
                <p className={/^[\p{L}]/u.test(a.summary) ? "dropcap" : undefined}>{a.summary}</p>
              </div>
            )}
              <div className="border border-rule bg-paper-raised p-6 sm:p-8 font-sans">
                <p className="kicker text-ink-mute">Tam metin</p>
                <p className="font-display text-2xl mt-2 leading-snug">
                  {a.externalUrl
                    ? "Bu yazının tam metni arşive aktarılıyor."
                    : "Bu metin basılı yayında; dijital tıpkıbasım hazırlanıyor."}
                </p>
                <p className="text-ink-soft mt-2 text-[0.95rem] leading-relaxed">
                  {a.externalUrl
                    ? "Aktarım tamamlanana kadar yazıyı özgün yayımlandığı yerde okuyabilirsiniz. Aktarıldığında bu sayfa okuma süresi, içindekiler ve yazı boyutu ayarıyla tam okuma deneyimi sunacak."
                    : "Künye bilgisi aşağıdadır. Tarama ve OCR sonrası metin bu sayfada tam okuma deneyimiyle yer alacak."}
                </p>
                {a.externalUrl && (
                  <a
                    href={a.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 bg-ink text-paper px-4 py-2.5 hover:bg-accent transition-colors"
                  >
                    {a.source}&apos;te oku <ArrowUpRight size={16} />
                  </a>
                )}
                <p className="mt-6 meta">
                  Okuma deneyiminin tam hâlini görmek için:{" "}
                  <Link href="/hakkinda/" className="underline underline-offset-2 hover:text-ink">
                    Arşiv hakkında
                  </Link>
                </p>
              </div>
            </>
          )}

          {/* Künye & atıf */}
          <section className="mt-14 border-t border-rule-strong pt-6 font-sans" aria-label="Künye">
            <p className="kicker text-ink-mute">Künye</p>
            <p className="mt-3 font-mono text-[0.82rem] leading-relaxed text-ink-soft break-words">{citationFor(a)}</p>
            <div className="mt-3 flex flex-wrap items-center gap-5">
              <CopyCitation text={citationFor(a)} />
              {a.externalUrl && (
                <a href={a.externalUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-ink-mute hover:text-ink inline-flex items-center gap-1">
                  Özgün yayın <ArrowUpRight size={13} />
                </a>
              )}
            </div>
            <div className="mt-6 flex flex-wrap gap-1.5">
              {a.tags.map((t) => (
                <TopicTag key={t} id={t} />
              ))}
            </div>
          </section>

          {/* Dizi gezgini */}
          {series && (prev || next) && (
            <nav className="mt-12 grid sm:grid-cols-2 gap-px bg-rule border border-rule" aria-label="Dizide gezin">
              {prev ? (
                <Link href={`/yazilar/${prev.slug}/`} className="group bg-paper p-5 hover:bg-paper-raised">
                  <span className="meta inline-flex items-center gap-1">
                    <ArrowLeft size={12} /> Önceki · {pl(prev)}. bölüm
                  </span>
                  <span className="block font-display text-lg mt-2 leading-snug link-underline">{shortTitle(prev)}</span>
                </Link>
              ) : (
                <span className="bg-paper" />
              )}
              {next ? (
                <Link href={`/yazilar/${next.slug}/`} className="group bg-paper p-5 hover:bg-paper-raised sm:text-right">
                  <span className="meta inline-flex items-center gap-1">
                    Sonraki · {pl(next)}. bölüm <ArrowRight size={12} />
                  </span>
                  <span className="block font-display text-lg mt-2 leading-snug link-underline">{shortTitle(next)}</span>
                </Link>
              ) : (
                <span className="bg-paper" />
              )}
            </nav>
          )}
        </div>

        {/* İlgili yazılar */}
        <aside className="lg:col-span-3">
          <div className="lg:sticky lg:top-28">
            <p className="kicker text-ink-mute mb-1">İlgili diğer yazılar</p>
            <p className="meta mb-4">Ortak konu, dizi ve döneme göre</p>
            <ul className="divide-y divide-rule border-y border-rule">
              {related.slice(0, 4).map((r) => (
                <li key={r.id}>
                  <Link href={`/yazilar/${r.slug}/`} className="group block py-4">
                    <span className="meta">
                      {r.source} · {formatDateShort(r.publishedAt, r.datePrecision)}
                    </span>
                    <span className="block font-display text-[1.08rem] leading-snug mt-1 link-underline">{r.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </article>
  );
}
