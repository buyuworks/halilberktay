import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ARTICLES, ARTICLE_SERIES } from "@/data/articles";
import { BOOKS } from "@/data/books";
import { RADAR } from "@/data/radar";
import { VIDEOS, VIDEO_SERIES } from "@/data/videos";
import { TIMELINE } from "@/data/timeline";
import { buildIndex, STATS } from "@/lib/content";
import { showcaseData } from "@/lib/showcase";
import { formatDate, formatDateShort } from "@/lib/format";
import { HeroSearch } from "@/components/HeroSearch";
import { RadarFeed } from "@/components/RadarFeed";
import { ArchiveShowcase } from "@/components/ArchiveShowcase";
import { BookCover } from "@/components/BookCover";
import { VideoShelf } from "@/components/VideoShelf";

function SectionHead({ kicker, title, href, linkLabel }: { kicker: string; title: string; href?: string; linkLabel?: string }) {
  return (
    <div className="rule-double pt-5 mb-8 flex items-end justify-between gap-6">
      <div>
        <p className="kicker text-accent">{kicker}</p>
        <h2 className="font-display text-headline mt-2 tracking-[-0.01em]">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="group hidden sm:inline-flex items-center gap-2 text-sm text-ink-soft hover:text-accent shrink-0">
          <span className="link-underline">{linkLabel}</span>
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}

export default function HomePage() {
  const index = buildIndex();
  const series = ARTICLE_SERIES[0];
  const parts = ARTICLES.filter((a) => a.series?.id === series.id).sort((a, b) => a.series!.part - b.series!.part);
  const latest = parts[parts.length - 1];
  const today = new Date("2026-11-02");

  return (
    <>
      {/* ——— HERO: portre bandı (koyu tema belirteçleriyle) ——— */}
      <section className="dark relative overflow-hidden bg-[#1d1c18] text-ink" aria-labelledby="hero-baslik">
        {/* Portre: masaüstünde sağa yaslı arka plan, mobilde üstte */}
        <div className="relative lg:absolute lg:inset-y-0 lg:right-0 lg:w-[62%] xl:w-[58%]" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/gorseller/portre-cizim.webp"
            alt=""
            width={1600}
            height={893}
            fetchPriority="high"
            className="block w-full h-[21rem] sm:h-[26rem] lg:h-full object-cover object-[88%_30%] lg:object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1d1c18] via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#1d1c18] lg:via-[#1d1c18]/10 lg:to-transparent" />
        </div>

        <div className="relative mx-auto max-w-page px-4 sm:px-6 lg:px-10 pb-12 sm:pb-16 lg:py-20 xl:py-24 -mt-6 lg:mt-0">
          <div className="hidden lg:flex items-center gap-6 meta mb-12">
            <span>{formatDate(today.toISOString().slice(0, 10))} · Pazartesi</span>
          </div>
          <div className="max-w-[40rem] animate-fade-up">
            <p className="kicker text-ink-mute">Tarihçi · Yazar</p>
            <h1 id="hero-baslik" className="font-display text-display tracking-[-0.025em] mt-4 font-[450]">
              Halil Berktay
            </h1>
            <p className="mt-6 font-display italic text-[1.4rem] sm:text-[1.6rem] leading-snug text-ink-soft">
              Kitaplar, makaleler, köşe yazıları ve konuşma kayıtları.
            </p>
            <div className="mt-10">
              <HeroSearch />
            </div>
            <p className="meta !text-[0.65rem] mt-10 inline-block border border-dashed border-ink-mute/50 px-2 py-0.5 rounded">
              Taslak portre · yapay zekâ ile üretildi, onay bekliyor
            </p>
          </div>
        </div>
      </section>

      {/* ——— KÜLLİYAT ŞERİDİ ——— */}
      <section className="mx-auto max-w-page px-4 sm:px-6 lg:px-10 pt-10 pb-14" aria-label="Külliyat">
        <dl className="grid grid-cols-2 lg:grid-cols-4 border-y border-rule divide-x divide-rule">
          {[
            ["Kitaplar", `${STATS.books}`, "1983 – 2018"],
            ["Köşe yazıları", `${STATS.columns}`, "Serbestiyet 2014– · Taraf aktarılacak"],
            ["Akademik metinler", `${STATS.academic}`, "1981 – 2005"],
            ["Video & ses", "100+", "saat · TV · podcast"],
          ].map(([k, v, s], i) => (
            <div key={k} className={`py-5 px-4 sm:px-6 first:pl-0 ${i === 2 ? "max-lg:pl-0 max-lg:border-l-0" : ""} ${i > 1 ? "max-lg:border-t max-lg:border-rule" : ""}`}>
              <dd className="font-display text-4xl tabular-nums">{v}</dd>
              <dt className="mt-1">
                <span className="block">{k}</span>
                <span className="meta">{s}</span>
              </dt>
            </div>
          ))}
        </dl>
        <p className="meta mt-3">Dizinde {index.length} kayıt · yazıların tam metinleri aktarılıyor.</p>
      </section>

      {/* ——— ÖNE ÇIKAN DİZİ + RADAR ——— */}
      <section className="mx-auto max-w-page px-4 sm:px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-14">
          <div className="lg:col-span-8">
            <div className="rule-double pt-5">
              <p className="kicker text-accent">Son dizi · Serbestiyet · Ağustos–Eylül 2026</p>
              <Link href={`/yazilar/${parts[0].slug}/`} className="group block mt-4">
                <h2 className="font-display text-[2.4rem] sm:text-[3.4rem] leading-[1.02] tracking-[-0.02em]">
                  <span className="link-underline">{series.title}</span>
                </h2>
              </Link>
              {series.description && <p className="mt-5 font-serif text-lg sm:text-xl text-ink-soft leading-relaxed max-w-2xl">{series.description}</p>}
              <p className="mt-4 meta">
                Son bölüm: {latest.series!.part}. {latest.title} · {formatDate(latest.publishedAt)}
              </p>
            </div>

            <ol className="mt-8 grid sm:grid-cols-2 gap-x-10 border-t border-rule">
              {parts.map((a) => (
                <li key={a.id} className="border-b border-rule">
                  <Link href={`/yazilar/${a.slug}/`} className="group flex gap-4 py-3.5">
                    <span className="font-display text-2xl text-accent/80 w-8 tabular-nums leading-none pt-0.5">
                      {String(a.series!.part).padStart(2, "0")}
                    </span>
                    <span className="flex-1">
                      <span className="block font-display text-[1.06rem] leading-snug link-underline">{a.title}</span>
                      <span className="meta">{formatDateShort(a.publishedAt)}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>

          {/* RADAR */}
          <aside className="lg:col-span-4" aria-labelledby="radar-baslik">
            <div className="lg:sticky lg:top-24 bg-paper-raised border border-rule p-6 sm:p-7">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-60 animate-ping" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
                </span>
                <p className="kicker text-accent">Kenar Notları</p>
              </div>
              <h2 id="radar-baslik" className="font-display text-[2rem] leading-tight mt-2">
                Bugünlerde masamda
              </h2>
              <p className="meta mt-1 mb-6">Okuduklarım, izlediklerim, takip ettiklerim</p>
              <RadarFeed items={RADAR.slice(0, 3)} />
              <Link href="/kenar-notlari/" className="group mt-6 pt-5 border-t border-rule flex items-center justify-between text-sm text-accent">
                <span className="link-underline">Tüm kenar notları</span>
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* ——— BİRLEŞİK ARŞİV ——— */}
      <section className="mx-auto max-w-page px-4 sm:px-6 lg:px-10 mt-24">
        <SectionHead kicker="Birleşik arşiv" title="Arşivden" href="/arsiv/" linkLabel="Gelişmiş arama" />
        <ArchiveShowcase {...showcaseData(index)} />
      </section>

      {/* ——— VİDEO BANDI ——— */}
      <section className="mt-24 bg-[#15130f] text-[#ebe5d8] dark:bg-paper-raised dark:border-y dark:border-rule">
        <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-10 py-16">
          <div className="flex items-end justify-between gap-6 border-t-[3px] border-double border-[#ebe5d8]/40 pt-5 mb-10">
            <div>
              <p className="kicker text-[#e0846f]">Video & ses kütüphanesi</p>
              <h2 className="font-display text-headline mt-2">Video ve ses kayıtları</h2>
            </div>
            <Link href="/videolar/" className="text-sm opacity-80 hover:opacity-100 underline-offset-4 hover:underline shrink-0">
              Tüm kayıtlar →
            </Link>
          </div>
          <VideoShelf videos={VIDEOS} series={VIDEO_SERIES} />
        </div>
      </section>

      {/* ——— KİTAPLAR ——— */}
      <section className="mx-auto max-w-page px-4 sm:px-6 lg:px-10 mt-24">
        <SectionHead kicker="Bibliyografya" title="Kitaplar" href="/kitaplar/" linkLabel="Tam bibliyografya" />
        <div className="flex gap-6 sm:gap-8 overflow-x-auto scrollbar-none pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x">
          {[...BOOKS]
            .filter((b) => b.id !== "b-2018-koprulu")
            .sort((a, b) => a.year - b.year)
            .map((b) => (
              <Link key={b.id} href={`/kitaplar/${b.slug}/`} className="group snap-start shrink-0 w-[9.5rem] sm:w-[11rem]">
                <BookCover book={b} className="transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-2" />
                <p className="mt-4 font-display text-[1.02rem] leading-snug">{b.title}</p>
                <p className="meta mt-1">
                  {b.year} · {b.role}
                </p>
              </Link>
            ))}
        </div>
      </section>

      {/* ——— BİYOGRAFİ ŞERİDİ ——— */}
      <section className="mx-auto max-w-page px-4 sm:px-6 lg:px-10 mt-24">
        <SectionHead kicker="Biyografi" title="Biyografi" href="/biyografi/" linkLabel="Zaman çizelgesi" />
        <ol className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 border-t border-rule">
          {[...TIMELINE]
            .filter((t) => t.kind === "Eğitim" || t.kind === "Akademi")
            .sort((a, b) => a.year - b.year)
            .slice(2, 8)
            .map((t) => (
              <li key={t.title} className="relative pt-6 pr-5 pb-2">
                <span className="absolute top-0 left-0 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-paper border-2 border-accent" />
                <p className="font-mono text-sm text-accent">
                  {t.year}
                  {t.endYear ? `–${String(t.endYear).slice(2)}` : ""}
                </p>
                <p className="font-display text-lg leading-snug mt-1">{t.title}</p>
                {t.place && <p className="meta mt-1">{t.place}</p>}
              </li>
            ))}
        </ol>
      </section>
    </>
  );
}
