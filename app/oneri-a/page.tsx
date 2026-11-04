import type { Metadata } from "next";
import { HomeRest, NotesStrip } from "@/components/HomeSections";
import { HeroSearchLink } from "@/components/HeroBits";

export const metadata: Metadata = { title: "Öneri A", robots: { index: false } };

/* ÖNERİ A: portre tam genişlikte ama alçaltılmış (sinematik kesim);
   hemen altında Kenar Notları üç sütunlu şerit olarak. */
export default function OneriA() {
  return (
    <>
      <section className="mx-auto max-w-page px-5 sm:px-8 lg:px-12 pt-6 sm:pt-10" aria-label="Giriş">
        <div className="relative overflow-hidden bg-[#1d1c18]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/gorseller/portre-cizim.webp"
            srcSet="/gorseller/portre-cizim-1000.webp 1000w, /gorseller/portre-cizim.webp 2000w"
            sizes="100vw"
            alt="Halil Berktay'ın mürekkep çizimi portresi"
            width={2000}
            height={1116}
            fetchPriority="high"
            className="block w-full h-[15rem] sm:h-[22rem] lg:h-[27rem] xl:h-[29rem] object-cover object-[100%_30%]"
          />
          <div className="hidden lg:flex absolute inset-y-0 left-0 w-[46%] flex-col justify-center pl-12 xl:pl-16 text-[#ebe5d8]">
            <p className="kicker text-[#ebe5d8]/60">Tarihçi · Yazar</p>
            <h1 className="font-display text-[3.4rem] xl:text-[4rem] tracking-[-0.025em] mt-3 font-[450]">Halil Berktay</h1>
            <p className="mt-4 font-display italic text-[1.3rem] leading-snug text-[#ebe5d8]/75">
              Kitaplar, makaleler, köşe yazıları ve konuşma kayıtları.
            </p>
            <div className="mt-7">
              <HeroSearchLink onDark />
            </div>
          </div>
        </div>
        <div className="lg:hidden pt-8">
          <p className="kicker text-ink-mute">Tarihçi · Yazar</p>
          <h1 className="font-display text-display tracking-[-0.025em] mt-3 font-[450]">Halil Berktay</h1>
        </div>
      </section>
      <NotesStrip />
      <HomeRest />
    </>
  );
}
