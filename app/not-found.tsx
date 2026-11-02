import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-10 py-24 text-center">
      <p className="kicker text-accent">404</p>
      <h1 className="font-display text-headline mt-3">Bu sayfa arşivde bulunamadı.</h1>
      <p className="mt-4 font-serif text-lg text-ink-soft">Sayfa taşınmış ya da henüz eklenmemiş olabilir.</p>
      <Link href="/arsiv/" className="inline-block mt-8 text-accent underline underline-offset-4">Arşivde arayın →</Link>
    </div>
  );
}
