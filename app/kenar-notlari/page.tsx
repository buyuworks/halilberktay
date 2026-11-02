import type { Metadata } from "next";
import { RADAR } from "@/data/radar";
import { RadarFeed } from "@/components/RadarFeed";

export const metadata: Metadata = {
  title: "Kenar Notları",
  description: "Halil Berktay'ın bugünlerde okudukları, izledikleri ve takip ettikleri, kısa notlarıyla.",
};

export default function RadarPage() {
  const cats = ["Kitap", "Makale", "Video", "Gündem"] as const;
  return (
    <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-10 pt-10 sm:pt-14">
      <header className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-60 animate-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
            </span>
            <p className="kicker text-accent">Kenar Notları</p>
          </div>
          <h1 className="font-display text-display tracking-[-0.02em] mt-3">Bugünlerde masamda</h1>
          <p className="mt-5 font-serif text-xl text-ink-soft leading-relaxed max-w-2xl">
            Halil Berktay&apos;ın bugünlerde okuduğu kitaplar, takip ettiği yazılar ve izlediği kayıtlar; kısa notlar ve bağlantılarla.
          </p>
        </div>
        <div className="lg:col-span-4 lg:border-l lg:border-rule lg:pl-8 self-end">
          <p className="kicker text-ink-mute mb-3">Bu akışta</p>
          <ul className="grid grid-cols-2 gap-y-2">
            {cats.map((c) => (
              <li key={c} className="flex items-baseline gap-2">
                <span className="font-display text-3xl tabular-nums">{RADAR.filter((r) => r.category === c).length}</span>
                <span className="text-ink-soft">{c}</span>
              </li>
            ))}
          </ul>
          <p className="meta mt-4 border border-dashed border-rule p-3 leading-relaxed">
            Prototip notu: Eserler gerçektir; yorum alanları Halil Berktay&apos;ın kendi notları için boş bırakıldı.
            Canlıda bu akış, telefondan bir bağlantı ve iki cümleyle güncellenebilen kısa bir formla beslenecek.
          </p>
        </div>
      </header>
      <div className="mt-12 rule-double">
        <RadarFeed items={RADAR} variant="page" />
      </div>
    </div>
  );
}
