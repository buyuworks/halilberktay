import type { Metadata } from "next";
import { BOOKS } from "@/data/books";
import { BookShelf } from "@/components/BookShelf";

export const metadata: Metadata = {
  title: "Kitaplar",
  description: "Halil Berktay'ın telif, ortak yazarlık, editörlük ve çeviri kitapları (1983–).",
};

export default function BooksPage() {
  return (
    <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-10 pt-10 sm:pt-14">
      <header className="grid lg:grid-cols-12 gap-8 items-end">
        <div className="lg:col-span-8">
          <p className="kicker text-accent">Bibliyografya</p>
          <h1 className="font-display text-display tracking-[-0.02em] mt-3">Kitaplar</h1>
          <p className="mt-5 font-serif text-xl text-ink-soft leading-relaxed max-w-2xl">
            Telif kitaplar, ortak çalışmalar, editörlükler ve çeviriler.
          </p>
        </div>
        <p className="lg:col-span-4 meta lg:text-right">
          Kapaklar: gerçek kapak taramaları gelene kadar tipografik olarak üretilir.
          <br />
          2010 sonrası yayınlar doğrulanarak eklenecek.
        </p>
      </header>
      <BookShelf books={BOOKS} />
    </div>
  );
}
