import type { Metadata } from "next";
import Link from "next/link";
import { TIMELINE } from "@/data/timeline";
import { BOOKS } from "@/data/books";
import { Timeline, type TLItem } from "@/components/Timeline";

export const metadata: Metadata = {
  title: "Biyografi",
  description: "Halil Berktay'ın akademik ve entelektüel biyografisi: eğitim, akademi, yayınlar ve kamusal yazarlık.",
};

export default function BiographyPage() {
  const bookEvents: TLItem[] = BOOKS.filter((b) => b.year !== 1983).map((b) => ({
    year: b.year,
    title: b.subtitle ? `${b.title}: ${b.subtitle}` : b.title,
    kind: "Yayın",
    detail: `${b.publisher} · ${b.role}${b.contributors ? ` · ${b.contributors}` : ""}`,
    href: `/kitaplar/${b.slug}/`,
  }));
  const items: TLItem[] = [...TIMELINE, ...bookEvents].sort((a, b) => a.year - b.year || (a.endYear ?? a.year) - (b.endYear ?? b.year));

  return (
    <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-10 pt-10 sm:pt-14">
      <header className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7">
          <p className="kicker text-accent">Biyografi</p>
          <h1 className="font-display text-display tracking-[-0.02em] mt-3">Biyografi</h1>
        </div>
        <div className="lg:col-span-5 lg:pt-10 font-serif text-lg leading-relaxed text-ink-soft space-y-4">
          <p>
            1947&apos;de İzmir&apos;de doğdu. Robert Akademi&apos;den sonra Yale&apos;de iktisat okudu; Ankara Üniversitesi Siyasal
            Bilgiler Fakültesi&apos;nde iktisat tarihi asistanı oldu. Doktorasını Birmingham Üniversitesi&apos;nde Chris
            Wickham&apos;ın danışmanlığında, &ldquo;The &lsquo;Other&rsquo; Feudalism&rdquo; teziyle tamamladı.
          </p>
          <p>
            ODTÜ, Boğaziçi ve uzun yıllar Sabancı Üniversitesi&apos;nde ders verdi; 2017&apos;den bu yana İbn Haldun Üniversitesi Tarih
            Bölümü&apos;nün başkanı. Akademik çalışmalarının yanı sıra Taraf ve Serbestiyet&apos;teki köşe yazıları ve video programlarıyla
            kamusal tartışmanın sürekli seslerinden biri.
          </p>
          <p className="meta">Kaynak: İbn Haldun Üniversitesi özgeçmişi, Wikipedia. Bkz. <Link href="/hakkinda/" className="underline">Bu site hakkında</Link>.</p>
        </div>
      </header>

      <div className="mt-16 rule-double pt-8 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-9">
          <Timeline items={items} />
        </div>
        <aside className="lg:col-span-3">
          <div className="lg:sticky lg:top-24 space-y-8">
            <div>
              <p className="kicker text-ink-mute mb-3">Eğitim</p>
              <ul className="space-y-2 text-[0.95rem]">
                <li>Yale Üniversitesi, BA İktisat, 1968</li>
                <li>Ankara Üniv. SBF, iktisat tarihi doktora çalışmaları</li>
                <li>Birmingham Üniversitesi, PhD Ortaçağ ve Modern Tarih, 1991</li>
              </ul>
            </div>
            <div>
              <p className="kicker text-ink-mute mb-3">Yayın kurulları</p>
              <ul className="space-y-2 text-[0.95rem]">
                <li>The Journal of Agrarian Change (danışma kurulu)</li>
                <li>Toplumsal Tarih (eski üye)</li>
                <li>Journal of Southeast European and Black Sea Studies (eski üye)</li>
                <li>CDRSEE Ortak Tarih Projesi, Tarih Eğitimi Komitesi (eski başkan yardımcısı)</li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
