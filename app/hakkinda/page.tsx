import type { Metadata } from "next";
import Link from "next/link";
import { ReadingProgress, ReaderControls, TableOfContents } from "@/components/ReaderTools";

export const metadata: Metadata = {
  title: "Arşiv hakkında",
  description: "Bu dijital arşivin nasıl kurgulandığı, içeriğin kaynakları ve arama ipuçları.",
};

const SECTIONS = [
  { id: "neden", text: "Neden bir arşiv?" },
  { id: "nasil", text: "Arşiv nasıl düzenlendi?" },
  { id: "arama", text: "Arama ve keşif" },
  { id: "kenar-notlari", text: "Kenar Notları: yaşayan defter" },
  { id: "kaynaklar", text: "Kaynaklar ve doğruluk" },
];

export default function AboutPage() {
  return (
    <article id="hakkinda" className="pb-10">
      <ReadingProgress targetId="hakkinda" />
      <header className="mx-auto max-w-page px-4 sm:px-6 lg:px-10 pt-10 sm:pt-16">
        <div className="max-w-4xl">
          <p className="kicker text-accent">Editörün notu</p>
          <h1 className="font-display text-[2.6rem] sm:text-[4rem] leading-[1.03] tracking-[-0.02em] mt-4">Arşiv hakkında</h1>
          <p className="mt-6 font-display italic text-[1.45rem] leading-snug text-ink-soft max-w-3xl">
            Yarım asırlık bir düşünce emeğini tek çatı altında, aranabilir ve okunabilir kılmak üzerine kısa bir kılavuz.
          </p>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 py-3 border-y border-rule">
          <span className="meta">Arşiv editörlüğü · Kasım 2026 · 6 dk okuma</span>
          <ReaderControls />
        </div>
      </header>

      <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-10 mt-12 grid lg:grid-cols-12 gap-10">
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-28">
            <TableOfContents items={SECTIONS} />
          </div>
        </aside>
        <div className="lg:col-span-6 prose-berktay">
          <p className="dropcap">
            Halil Berktay&apos;ın yazıları dört on yıla, onlarca mecraya ve birkaç dile dağılmış durumda: Toplum ve Bilim&apos;in
            1980&apos;lerdeki sayıları, The Journal of Peasant Studies, derleme kitaplardaki bölümler, Taraf&apos;taki günlük
            köşe, Serbestiyet&apos;teki yazı dizileri ve bunlara eşlik eden yüzlerce saatlik video ve ses kaydı. Bu dağınıklık,
            okurun bir düşüncenin izini sürmesini zorlaştırıyor.
          </p>
          <p>
            Bu arşiv, o izi sürmeyi kolaylaştırmak için kuruldu. Amaç yalnızca metinleri bir araya getirmek değil; aralarındaki
            bağları da görünür kılmak. Bir köşe yazısının otuz yıl önceki bir akademik makaleyle, bir video dizisinin bir kitapla
            nasıl konuştuğunu göstermek.
          </p>

          <h2 id="neden">Neden bir arşiv?</h2>
          <p>
            Gazete siteleri yayın akışına göre düzenlenir: en yeni yazı en üstte, eskiler sayfalar boyunca aşağıya itilir. Bir
            tarihçinin külliyatı ise başka türlü okunmayı hak eder. Konuya, döneme, tartışmaya göre.
          </p>
          <blockquote>Arşiv, tarihçinin kendi metinlerine de bir tarihçi gibi bakabilmesinin aracıdır.</blockquote>
          <p>
            Bu nedenle her kayıt; tür, mecra, yayın tarihi ve konu etiketleriyle işaretlendi. Böylece örneğin &ldquo;1990&apos;larda
            feodalizm üzerine yazılanlar&rdquo; ya da &ldquo;Serbestiyet&apos;te devrimler üzerine diziler&rdquo; tek bir aramayla
            bulunabiliyor.
          </p>

          <h2 id="nasil">Arşiv nasıl düzenlendi?</h2>
          <p>
            Arşivin omurgası beş içerik türünden oluşuyor: yazılar (köşe yazıları, akademik makaleler, kitap bölümleri), video ve
            ses kayıtları, kitaplar ve kenar notları. Hepsi aynı ortak dizine yazılıyor; bu da arama ve filtrelemenin türler arasında
            kesintisiz çalışmasını sağlıyor.
          </p>
          <p>
            Berktay&apos;ın sıkça kullandığı numaralı yazı dizileri ayrı bir yapı olarak modellendi. Bir dizinin herhangi bir
            bölümünü okurken, kenar sütunda dizinin tamamı ve önceki/sonraki bölüm bağlantıları görünüyor.
          </p>

          <h2 id="arama">Arama ve keşif</h2>
          <p>
            Sitenin her yerinden <strong>⌘K</strong> (Windows&apos;ta <strong>Ctrl+K</strong>) ya da <strong>/</strong> tuşuyla arama
            penceresi açılır. Arama Türkçe karakterlere duyarsızdır: &ldquo;milli mucadele&rdquo; yazmak &ldquo;Millî
            Mücadele&rdquo;yi bulur; küçük yazım hatalarını da tolere eder.
          </p>
          <p>
            Daha ayrıntılı keşif için <Link href="/arsiv/">Birleşik Arşiv</Link> sayfası; tür, mecra, konu ve yıl filtrelerini
            birbiriyle kesiştirmenize izin verir. Her filtrenin yanındaki sayı, diğer seçimleriniz geçerliyken o filtrenin kaç sonuç
            getireceğini gösterir; böylece hiçbir zaman boş bir sonuç sayfasına düşmezsiniz. Yıl histogramı, külliyatın zaman
            içindeki yoğunluğunu da bir bakışta gösterir.
          </p>

          <h2 id="kenar-notlari">Kenar Notları: yaşayan defter</h2>
          <p>
            Arşiv geçmişe bakarken Kenar Notları bugüne bakar. Berktay&apos;ın o hafta okuduğu kitaplar, takip ettiği makaleler ve izlediği
            kayıtlar, kendi kısa notlarıyla birlikte burada paylaşılır. Kenar notları da arşive dahildir ve aranabilir.
          </p>

          <h2 id="kaynaklar">Kaynaklar ve doğruluk</h2>
          <p>
            Prototipteki künye bilgileri İbn Haldun Üniversitesi&apos;ndeki özgeçmişten, Serbestiyet yazar arşivinden ve kamuya açık
            ansiklopedik kaynaklardan derlendi. Tam metinler ve YouTube kayıt kimlikleri aktarım sürecinde eklenecek. Henüz
            doğrulanmamış ya da tasarım için yazılmış her içerik, arayüzde açıkça &ldquo;örnek&rdquo; ya da &ldquo;doğrulanacak&rdquo;
            olarak işaretlendi.
          </p>
        </div>
      </div>
    </article>
  );
}
