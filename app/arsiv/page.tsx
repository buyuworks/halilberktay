import type { Metadata } from "next";
import { Suspense } from "react";
import { ArchiveExplorer } from "@/components/ArchiveExplorer";

export const metadata: Metadata = {
  title: "Birleşik Arşiv",
  description: "Makale, video, ses kaydı, kitap ve kenar notlarında tür, mecra, konu ve yıl filtreleriyle arama.",
};

export default function ArchivePage() {
  return (
    <>
      <header className="mx-auto max-w-page px-4 sm:px-6 lg:px-10 pt-10 sm:pt-14 pb-4">
        <p className="kicker text-accent">Birleşik arşiv</p>
        <h1 className="font-display text-headline mt-2 tracking-[-0.01em]">Arşiv</h1>
        <p className="mt-3 max-w-2xl font-serif text-lg text-ink-soft">
          Yazılar, makaleler, video ve ses kayıtları, kitaplar ve kenar notları. Tür, kaynak, konu ve yıla göre süzülebilir.
        </p>
      </header>
      <Suspense fallback={<div className="mx-auto max-w-page px-10 py-20 meta">Arşiv yükleniyor…</div>}>
        <ArchiveExplorer />
      </Suspense>
    </>
  );
}
