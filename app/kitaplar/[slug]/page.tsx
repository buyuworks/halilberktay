import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { BOOKS } from "@/data/books";
import { ARTICLES } from "@/data/articles";
import { BookCover } from "@/components/BookCover";
import { TopicTag } from "@/components/EntryViews";
import { CopyCitation } from "@/components/ReaderTools";

export function generateStaticParams() {
  return BOOKS.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const b = BOOKS.find((x) => x.slug === slug);
  return b ? { title: b.title, description: b.description } : {};
}

export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const b = BOOKS.find((x) => x.slug === slug);
  if (!b) notFound();

  const roleLine = b.role === "Yazar" ? "Halil Berktay" : `Halil Berktay (${b.role.toLocaleLowerCase("tr")})`;
  const citation = `${roleLine}${b.contributors ? `; ${b.contributors}` : ""}. ${b.title}${b.subtitle ? `: ${b.subtitle}` : ""}. ${b.publisher}, ${b.year}.`;
  const related = ARTICLES.filter((a) => a.tags.some((t) => b.tags.includes(t)))
    .sort((x, y) => y.tags.filter((t) => b.tags.includes(t)).length - x.tags.filter((t) => b.tags.includes(t)).length)
    .slice(0, 5);
  const others = BOOKS.filter((x) => x.id !== b.id).sort((x, y) => Math.abs(x.year - b.year) - Math.abs(y.year - b.year)).slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: b.title,
    alternativeHeadline: b.subtitle,
    author: { "@type": "Person", name: "Halil Berktay" },
    publisher: b.publisher,
    datePublished: String(b.year),
    inLanguage: b.language,
    description: b.description,
  };

  return (
    <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-10 pt-10 sm:pt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/kitaplar/" className="meta inline-flex items-center gap-1 hover:text-ink">
        <ArrowLeft size={12} /> Tüm kitaplar
      </Link>

      <div className="mt-8 grid lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="max-w-[20rem] mx-auto lg:mx-0 lg:sticky lg:top-24">
            <BookCover book={b} size="lg" />
          </div>
        </div>
        <div className="lg:col-span-8">
          <p className="kicker text-accent">
            {b.role} · {b.year}
          </p>
          <h1 className="font-display text-[2.6rem] sm:text-[3.8rem] leading-[1.02] tracking-[-0.02em] mt-3">{b.title}</h1>
          {b.subtitle && <p className="font-display italic text-2xl sm:text-3xl text-ink-soft mt-2">{b.subtitle}</p>}
          {b.englishTitle && <p className="meta mt-3">İng. {b.englishTitle}</p>}

          <p className="mt-8 font-serif text-xl leading-relaxed max-w-measure">{b.description}</p>

          <dl className="mt-10 grid sm:grid-cols-2 border-t border-rule">
            {[
              ["Yayınevi", b.publisher],
              ["Yıl", String(b.year)],
              ["Katkı", b.role],
              ["Dil", b.language === "tr" ? "Türkçe" : "İngilizce"],
              ...(b.contributors ? [["Birlikte", b.contributors]] : []),
            ].map(([k, v]) => (
              <div key={k} className="py-3 border-b border-rule sm:pr-6">
                <dt className="kicker text-ink-mute">{k}</dt>
                <dd className="mt-1">{v}</dd>
              </div>
            ))}
          </dl>

          {b.editions && (
            <div className="mt-10">
              <p className="kicker text-ink-mute mb-3">Baskılar</p>
              <ol className="border-l border-rule ml-1">
                {b.editions.map((e) => (
                  <li key={e.year} className="relative pl-6 pb-4">
                    <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-paper border-2 border-accent" />
                    <span className="font-mono text-accent">{e.year}</span> · {e.publisher}
                    {e.note && <span className="block text-sm text-ink-mute">{e.note}</span>}
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div className="mt-10 bg-paper-raised border border-rule p-5">
            <p className="kicker text-ink-mute">Künye</p>
            <p className="font-mono text-sm mt-2 text-ink-soft">{citation}</p>
            <div className="mt-2">
              <CopyCitation text={citation} />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-1.5">
            {b.tags.map((t) => (
              <TopicTag key={t} id={t} />
            ))}
          </div>

          {related.length > 0 && (
            <section className="mt-16">
              <p className="kicker text-ink-mute mb-1">Bu kitapla konuşan yazılar</p>
              <ul className="border-t border-rule mt-3">
                {related.map((a) => (
                  <li key={a.id} className="border-b border-rule">
                    <Link href={`/yazilar/${a.slug}/`} className="group flex justify-between gap-6 py-3">
                      <span className="font-display text-lg link-underline">{a.title}</span>
                      <span className="meta shrink-0">{a.publishedAt.slice(0, 4)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>

      <section className="mt-24 rule-double pt-5">
        <p className="kicker text-ink-mute mb-8">Rafta yanındakiler</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {others.map((o) => (
            <Link key={o.id} href={`/kitaplar/${o.slug}/`} className="group">
              <BookCover book={o} className="transition-transform duration-500 group-hover:-translate-y-1.5" />
              <p className="font-display mt-3 leading-snug">{o.title}</p>
              <p className="meta">{o.year}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
