import type { Metadata } from "next";
import { Suspense } from "react";
import { buildIndex } from "@/lib/content";
import { ArchiveExplorer } from "@/components/ArchiveExplorer";

export const metadata: Metadata = {
  title: "Birleşik Arşiv",
  description: "Makale, video, ses kaydı, kitap ve radar kayıtlarında tür, mecra, konu ve yıl filtreleriyle arama.",
};

export default function ArchivePage() {
  const index = buildIndex();
  return (
    <>
      <header className="mx-auto max-w-page px-4 sm:px-6 lg:px-10 pt-10 sm:pt-14 pb-4">
        <p className="kicker text-accent">Birleşik arşiv</p>
        <h1 className="font-display text-headline mt-2 tracking-[-0.01em]">Arşivde arayın, kesiştirin, keşfedin</h1>
        <p className="mt-3 max-w-2xl font-serif text-lg text-ink-soft">
          Yazılar, akademik makaleler, video ve ses kayıtları, kitaplar ve radar notları tek bir dizinde. Filtreler
          birbirleriyle kesişir; adres çubuğundaki bağlantı aramanızı olduğu gibi paylaşır.
        </p>
      </header>
      <Suspense fallback={<div className="mx-auto max-w-page px-10 py-20 meta">Arşiv yükleniyor…</div>}>
        <ArchiveExplorer entries={index} />
      </Suspense>
    </>
  );
}
