import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Bu site hakkında",
  description: "Sitede neler var, nasıl aranır, bilgiler nereden geliyor.",
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-page px-4 sm:px-6 lg:px-10 pt-10 sm:pt-16 pb-16">
      <header className="max-w-3xl">
        <h1 className="font-display text-headline tracking-[-0.01em]">Bu site hakkında</h1>
      </header>

      <div className="mt-10 max-w-measure prose-berktay">
        <h2 id="icerik">İçerik</h2>
        <ul className="space-y-2">
          <li>
            <Link href="/yazilar/" className="font-medium underline underline-offset-2">Yazılar</Link>: Serbestiyet ve Taraf&apos;taki köşe yazıları, yazı dizileri, akademik makaleler ve
            kitap bölümleri.
          </li>
          <li>
            <Link href="/kitaplar/" className="font-medium underline underline-offset-2">Kitaplar</Link>: telif kitaplar, ortak çalışmalar, editörlükler ve çeviriler.
          </li>
          <li>
            <Link href="/videolar/" className="font-medium underline underline-offset-2">Video ve ses kayıtları</Link>: anlatım dizileri, programlar, konferanslar ve podcast kayıtları.
          </li>
          <li>
            <Link href="/kenar-notlari/" className="font-medium underline underline-offset-2">Kenar Notları</Link>: güncel okumalar ve izlemeler üzerine kısa notlar.
          </li>
        </ul>

        <h2 id="arama">Arama</h2>
        <p>
          Her sayfadan <strong>⌘K</strong> (Windows&apos;ta <strong>Ctrl+K</strong>) ya da <strong>/</strong> tuşuyla arama penceresi
          açılır. Türkçe karakter yazmak gerekmez: &ldquo;milli mucadele&rdquo; aramasında &ldquo;Millî Mücadele&rdquo; geçen
          kayıtlar da çıkar.
        </p>
        <p>
          <Link href="/arsiv/">Arşiv</Link> sayfasında kayıtlar tür, kaynak, konu ve yıla göre süzülebilir. Süzgeçler adres
          çubuğuna yazılır; bağlantı paylaşıldığında aynı sonuçlar açılır.
        </p>

        <h2 id="kaynaklar">Kaynaklar</h2>
        <p>
          Künye bilgileri özgeçmişten, Serbestiyet yazar arşivinden ve kamuya açık kaynaklardan derlendi. Yazıların tam metinleri
          ve video bağlantıları aktarılıyor. Henüz doğrulanmamış bilgiler sitede işaretlidir.
        </p>
      </div>
    </article>
  );
}
