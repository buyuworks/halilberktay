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
import { RadarFeed } from "@/components/RadarFeed";
import { ArchiveShowcase } from "@/components/ArchiveShowcase";
import { BookCover } from "@/components/BookCover";
import { VideoShelf } from "@/components/VideoShelf";
import { ImageSlot } from "@/components/ImageSlot";

/* Öneri aşaması deneme görselleri (Higgsfield, GPT Image 2.5). Onaylanırsa indirilip
   public/gorseller altına webp olarak alınacak; şimdilik doğrudan bağlantı. */
const CDN = "https://d8j0ntlcm91z4.cloudfront.net/user_35wjp34o5FNPFnGZPI3DSTMiLUv/";
export const DENEME = {
  G1: CDN + "hf_20261104_134746_e492611a-ac4b-4dd3-83c5-d1745920b5a1.png",
  G2: CDN + "hf_20261104_134755_3f140c40-31ca-49b8-97dc-429ae4e600fe.png",
  G3: CDN + "hf_20261104_134742_79c8a191-5a47-4871-911a-c2c38c74c641.png",
  G4: CDN + "hf_20261104_134803_a04cf91b-e4a4-4412-807e-15ccce99ed1c.png",
};

/* Ana sayfa bölümleri — "ferah" öneri sürümü.
   Ortak ilke: bölümler arası 8–11rem boşluk, bölüm başına tek odak,
   listelerde daha az kayıt ve daha geniş satır aralığı. */

const WRAP = "mx-auto max-w-page px-5 sm:px-8 lg:px-12";
const GAP = "mt-32 lg:mt-44";

export function SectionHead({ kicker, title, href, linkLabel }: { kicker: string; title: string; href?: string; linkLabel?: string }) {
  return (
    <div className="rule-double pt-6 mb-12 lg:mb-16 flex items-end justify-between gap-6">
      <div>
        <p className="kicker text-accent">{kicker}</p>
        <h2 className="font-display text-headline mt-3 tracking-[-0.01em]">{title}</h2>
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

export function LiveDot() {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-60 animate-ping" />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
    </span>
  );
}

/** Kenar notları başlığı (sütun ve şerit sürümlerinde ortak) */
export function NotesHead({ id, size = "md" }: { id: string; size?: "md" | "lg" }) {
  return (
    <div>
      <div className="flex items-center gap-2.5">
        <LiveDot />
        <p className="kicker text-accent">Kenar Notları</p>
      </div>
      <h2 id={id} className={size === "lg" ? "font-display text-headline mt-3 tracking-[-0.01em]" : "font-display text-[2rem] leading-tight mt-2"}>
        Bugünlerde masamda
      </h2>
      <p className="meta mt-2">Okuduklarım, izlediklerim, takip ettiklerim</p>
    </div>
  );
}

export function NotesAllLink({ className = "" }: { className?: string }) {
  return (
    <Link href="/kenar-notlari/" className={`group inline-flex items-center gap-2 text-sm text-accent ${className}`}>
      <span className="link-underline">Tüm kenar notları</span>
      <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

export function NotesColumn({ count = 3 }: { count?: number }) {
  return (
    <aside aria-labelledby="notlar-baslik" className="flex flex-col h-full">
      <NotesHead id="notlar-baslik" />
      <div className="mt-9 flex-1">
        <RadarFeed items={RADAR.slice(0, count)} />
      </div>
      <NotesAllLink className="mt-6" />
    </aside>
  );
}

export function NotesStrip() {
  return (
    <section className={`${WRAP} pt-14 lg:pt-16`} aria-labelledby="notlar-serit">
      <div className="flex items-end justify-between gap-6 mb-8">
        <NotesHead id="notlar-serit" />
        <NotesAllLink className="hidden sm:inline-flex shrink-0" />
      </div>
      <RadarFeed items={RADAR.slice(0, 3)} variant="strip" />
      <NotesAllLink className="sm:hidden mt-8" />
    </section>
  );
}

export function HomeRest() {
  const index = buildIndex();
  const series = ARTICLE_SERIES[0];
  const parts = ARTICLES.filter((a) => a.series?.id === series.id).sort((a, b) => a.series!.part - b.series!.part);
  const latest = parts[parts.length - 1];
  const recentParts = parts.slice(-4).reverse();

  return (
    <>
      {/* ——— SON DİZİ: başlık solda, son 4 bölüm sağda ——— */}
      <section className={`${WRAP} ${GAP}`} aria-labelledby="dizi-baslik">
        <div className="rule-double pt-6 grid lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="kicker text-accent">Son dizi · Serbestiyet · Ağustos–Eylül 2026</p>
            <Link href={`/yazilar/${parts[0].slug}/`} className="group block mt-5">
              <h2 id="dizi-baslik" className="font-display text-[2.4rem] sm:text-[3.2rem] leading-[1.04] tracking-[-0.02em]">
                <span className="link-underline">{series.title}</span>
              </h2>
            </Link>
            <p className="mt-6 meta">
              {parts.length} bölüm · son bölüm {formatDate(latest.publishedAt)}
            </p>
            <Link href={`/yazilar/${parts[0].slug}/`} className="group mt-8 inline-flex items-center gap-2 text-accent">
              <span className="link-underline">Diziyi baştan oku</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <ol className="lg:col-span-7 border-t border-rule lg:border-t-0">
            {recentParts.map((a) => (
              <li key={a.id} className="border-b border-rule first:lg:border-t">
                <Link href={`/yazilar/${a.slug}/`} className="group flex gap-6 py-6">
                  <span className="font-display text-3xl text-accent/80 w-10 tabular-nums leading-none pt-0.5">
                    {String(a.series!.part).padStart(2, "0")}
                  </span>
                  <span className="flex-1">
                    <span className="block font-display text-[1.3rem] leading-snug link-underline">{a.title}</span>
                    <span className="meta mt-1.5 block">{formatDateShort(a.publishedAt)}</span>
                  </span>
                </Link>
              </li>
            ))}
            <li className="pt-5">
              <Link href={`/diziler/`} className="meta hover:text-accent">
                Önceki {parts.length - recentParts.length} bölüm ve diğer diziler →
              </Link>
            </li>
          </ol>
        </div>
      </section>

      {/* ——— KÜLLİYAT: sade sayılar, çerçevesiz ——— */}
      <section className={`${WRAP} ${GAP}`} aria-label="Külliyat">
        <dl className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8">
          {[
            ["Kitap", `${STATS.books}`, "1983 – 2018"],
            ["Köşe yazısı", `${STATS.columns}`, "Serbestiyet, 2014’ten bu yana"],
            ["Akademik metin", `${STATS.academic}`, "1981 – 2005"],
            ["Saat video ve ses", "100+", "TV, konferans, podcast"],
          ].map(([k, v, s]) => (
            <div key={k} className="border-l border-rule pl-6">
              <dd className="font-display text-5xl lg:text-6xl tabular-nums font-[400]">{v}</dd>
              <dt className="mt-3">
                <span className="block text-ink">{k}</span>
                <span className="meta">{s}</span>
              </dt>
            </div>
          ))}
        </dl>
      </section>

      {/* ——— ARŞİV: geniş görsel alanı + 6 kayıt ——— */}
      <section className={`${WRAP} ${GAP}`} aria-labelledby="arsiv-baslik">
        <div className="relative mb-14 lg:mb-20">
          <ImageSlot src={DENEME.G2} alt="" code="G2" ratio="21:9" label="Arşiv: gazete kupürleri, dosyalar, kitap sırtları" className="w-full" />
        </div>
        <SectionHead kicker="Birleşik arşiv" title="Arşivden" href="/arsiv/" linkLabel="Gelişmiş arama" />
        <ArchiveShowcase {...showcaseData(index)} limit={6} />
      </section>

      {/* ——— VİDEO BANDI ——— */}
      <section className={`${GAP} bg-[#15130f] text-[#ebe5d8] dark:bg-paper-raised dark:border-y dark:border-rule`}>
        <div className={`${WRAP} py-24 lg:py-32`}>
          <div className="flex items-end justify-between gap-6 border-t-[3px] border-double border-[#ebe5d8]/40 pt-6 mb-14">
            <div>
              <p className="kicker text-[#e0846f]">Video & ses kütüphanesi</p>
              <h2 className="font-display text-headline mt-3">Video ve ses kayıtları</h2>
            </div>
            <Link href="/videolar/" className="text-sm opacity-80 hover:opacity-100 underline-offset-4 hover:underline shrink-0">
              Tüm kayıtlar →
            </Link>
          </div>
          <VideoShelf videos={VIDEOS} series={VIDEO_SERIES} limit={3} />
        </div>
      </section>

      {/* ——— KİTAPLAR: solda görsel alanı, sağda raf ——— */}
      <section className={`${WRAP} ${GAP}`} aria-labelledby="kitap-baslik">
        <SectionHead kicker="Bibliyografya" title="Kitaplar" href="/kitaplar/" linkLabel="Tam bibliyografya" />
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="hidden lg:block lg:col-span-4">
            <ImageSlot src={DENEME.G3} alt="" code="G3" ratio="4:5" label="Masa üstü: üst üste kitaplar, gözlük" />
          </div>
          <div className="lg:col-span-8 flex gap-8 sm:gap-10 overflow-x-auto scrollbar-none pb-6 -mx-5 px-5 sm:mx-0 sm:px-0 snap-x">
            {[...BOOKS]
              .filter((b) => b.id !== "b-2018-koprulu")
              .sort((a, b) => a.year - b.year)
              .map((b) => (
                <Link key={b.id} href={`/kitaplar/${b.slug}/`} className="group snap-start shrink-0 w-[10rem] sm:w-[11.5rem]">
                  <BookCover book={b} className="transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-2" />
                  <p className="mt-5 font-display text-[1.05rem] leading-snug">{b.title}</p>
                  <p className="meta mt-1.5">
                    {b.year} · {b.role}
                  </p>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* ——— BİYOGRAFİ: zaman çizelgesine hizalı şehir panoraması ——— */}
      <section className={`${WRAP} ${GAP} mb-32 lg:mb-44`} aria-labelledby="bio-baslik">
        <SectionHead kicker="Biyografi" title="Biyografi" href="/biyografi/" linkLabel="Zaman çizelgesi" />
        <ImageSlot src={DENEME.G4} alt="" code="G4" ratio="6:1" label="Şehir panoraması: New Haven · Birmingham · Ankara · İstanbul" className="w-full mb-10" />
        <ol className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-y-10 border-t border-rule">
          {[...TIMELINE]
            .filter((t) => t.kind === "Eğitim" || t.kind === "Akademi")
            .sort((a, b) => a.year - b.year)
            .slice(2, 8)
            .map((t) => (
              <li key={t.title} className="relative pt-7 pr-6">
                <span className="absolute top-0 left-0 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-paper border-2 border-accent" />
                <p className="font-mono text-sm text-accent">
                  {t.year}
                  {t.endYear ? `–${String(t.endYear).slice(2)}` : ""}
                </p>
                <p className="font-display text-lg leading-snug mt-2">{t.title}</p>
                {t.place && <p className="meta mt-1.5">{t.place}</p>}
              </li>
            ))}
        </ol>
      </section>
    </>
  );
}
