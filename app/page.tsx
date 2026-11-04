import { HomeRest, NotesColumn } from "@/components/HomeSections";
import { HeroSearchLink } from "@/components/HeroBits";

/* ÖNERİ B (varsayılan): ilk ekranda portre ve Kenar Notları yan yana.
   Portre küçülür (8 sütun), sağ 4 sütunda son iki not. */

function Name({ onDark }: { onDark?: boolean }) {
  return (
    <div className="animate-fade-up">
      <p className={`kicker ${onDark ? "text-[#ebe5d8]/60" : "text-ink-mute"}`}>Tarihçi · Yazar</p>
      <h1 className="font-display text-display lg:text-[2.7rem] xl:text-[3.25rem] lg:whitespace-nowrap tracking-[-0.025em] mt-3 font-[450]">
        Halil Berktay
      </h1>
    </div>
  );
}

function Tagline() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 sm:gap-10">
      <p className="font-display italic text-[1.25rem] xl:text-[1.35rem] leading-snug text-ink-soft max-w-[26rem]">
        Kitaplar, makaleler, köşe yazıları ve konuşma kayıtları.
      </p>
      <div className="shrink-0">
        <HeroSearchLink />
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <section className="mx-auto max-w-page px-5 sm:px-8 lg:px-12 pt-6 sm:pt-10 lg:pt-12" aria-label="Giriş">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-14 xl:gap-16 items-stretch">
          <div className="lg:col-span-8">
            <div className="relative overflow-hidden bg-[#1d1c18]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/gorseller/portre-cizim.webp"
                srcSet="/gorseller/portre-cizim-1000.webp 1000w, /gorseller/portre-cizim.webp 2000w"
                sizes="(min-width: 1024px) 66vw, 100vw"
                alt="Halil Berktay'ın mürekkep çizimi portresi"
                width={2000}
                height={1116}
                fetchPriority="high"
                className="block w-full h-[15rem] sm:h-[24rem] lg:h-auto object-cover object-right"
              />
              <div className="hidden lg:flex absolute inset-y-0 left-0 w-[48%] flex-col justify-center pl-9 xl:pl-12 pr-4 text-[#ebe5d8]">
                <Name onDark />
              </div>
            </div>
            <div className="lg:hidden pt-9">
              <Name />
            </div>
            <div className="pt-6 lg:pt-9">
              <Tagline />
            </div>
          </div>
          <div className="lg:col-span-4 border-t border-rule pt-10 lg:border-t-0 lg:pt-0 lg:border-l lg:pl-10 xl:pl-12">
            <NotesColumn count={2} />
          </div>
        </div>
      </section>
      <HomeRest />
    </>
  );
}
