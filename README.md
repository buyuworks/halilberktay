# Halil Berktay · Arşiv ve Defter (prototip)

Tarihçi Prof. Dr. Halil Berktay'ın kitapları, köşe yazıları, akademik makaleleri, video/ses kayıtları ve güncel okumalarını ("Entelektüel Radar") tek çatı altında toplayan dijital arşiv.

## Çalıştırma

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # statik çıktı: out/ (her statik barındırmada çalışır: Vercel, Netlify, GitHub Pages, Cloudflare Pages)
```

## 1. Mimari ve teknoloji yığını

| Katman | Seçim | Neden |
|---|---|---|
| Çatı | **Next.js 16 App Router**, `output: "export"` | Tüm sayfalar derleme anında HTML olarak üretilir: anında açılış, tam SEO, sunucu maliyeti sıfır. İleride ISR/sunucuya geçmek tek satır. |
| Stil | **Tailwind CSS 4** + CSS değişkenli tasarım belirteçleri | Açık/koyu tema aynı belirteçlerle; `@theme` blokları tasarım sisteminin tek kaynağı. |
| İkonlar | lucide-react | İnce çizgili, editoryal tona uyumlu. |
| Arama | **Fuse.js** + Türkçe karakter katlama (`lib/search.ts`) | "milli mucadele" → "Millî Mücadele". Bulanık eşleşme, alan ağırlıkları (başlık > özet > künye). |
| Filtre | Fasetli çapraz filtre (`components/ArchiveExplorer.tsx`) | Her sayaç diğer filtreler uygulanmış hâlde hesaplanır; kullanıcı asla boş sonuca düşmez. Durum URL'de → paylaşılabilir arama. |
| Veri | Tipli TS veri dosyaları (`data/*.ts`, şema `lib/types.ts`) | CMS'e geçişte şema aynen korunur. |
| SEO | Schema.org JSON-LD (OpinionNewsArticle, ScholarlyArticle, Book, VideoObject), OpenGraph | Google'da makale/kitap zengin sonuçları. |

**Ölçeklenme yolu (1000+ yazı):** Veri → headless CMS (Sanity / Payload) veya Postgres; arama → derleme anında **Pagefind** (statik, ücretsiz) ya da **Meilisearch/Typesense** (anlık, yazım hatası toleranslı). Radar akışı → CMS'te telefondan doldurulabilen kısa form.

## 2. Tasarım sistemi

- **Renk:** kağıt `#F6F2EA`, mürekkep `#1B1A17`, kiremit-bordo vurgu `#8B261D`, akademik lacivert `#1F3550` (ikincil). Karanlık okuma modu: sıcak kömür `#15130F` üzerine kağıt rengi metin, vurgu `#E0846F`. Tümü `app/globals.css` içinde.
- **Tipografi (4 rol):**
  - *Newsreader* (başlık): optik boyutlu, gazete için çizilmiş; Playfair'den daha az "dekoratif", uzun başlıklarda daha okunaklı.
  - *Source Serif 4* (uzun metin): ekranda okuma için optimize, 68 karakter satır, 1.72 satır aralığı.
  - *Inter* (arayüz), *IBM Plex Mono* (tarih, künye, sayılar: arşiv fişi hissi).
- **Yerleşim:** 12 kolonlu asimetrik grid, 1px çizgiler, `3px double` editoryal bölüm çizgileri.

### Brif'ten saptığım yerler (ve nedenleri)
1. **Font:** Playfair/Cormorant yerine Newsreader + Source Serif 4. Türkçe karakterlerde daha dengeli, uzun okumada daha az yorucu.
2. **Mono künye fontu:** Tarihleri ve kaynakları ayrı bir "katalog" sesiyle vermek arşiv kimliğini güçlendiriyor.
3. **Yazı dizileri birinci sınıf veri:** Berktay sık sık 4-14 bölümlük diziler yazıyor. Diziler ayrı modellendi; okuyucuda kenar sütun gezgini ve önceki/sonraki bölüm.
4. **Yıl histogramı:** Tarih filtresi düz bir kaydırıcı değil; külliyatın zaman içindeki yoğunluğunu da gösteren tıklanabilir bir grafik.
5. **Tipografik kapaklar:** Gerçek kapak taranana kadar her kitap için üretilen kapaklar (düzen "boş görsel" görünmüyor).
6. **Video cephesi (facade):** YouTube oynatıcı yalnızca tıklanınca yüklenir: hız ve KVKK.

## 3. Veri durumu

| Veri | Durum | Kaynak |
|---|---|---|
| 30 Serbestiyet yazısı (başlık, tarih, bağlantı) | ✅ doğrulandı | serbestiyet.com yazar sayfası |
| 15 akademik makale / kitap bölümü künyesi | ✅ doğrulandı | İbn Haldun Üniv. özgeçmişi |
| 13 kitap | ✅ doğrulandı (2010 sonrası eksik olabilir) | Özgeçmiş + Wikipedia |
| Biyografi zaman çizelgesi | ✅ doğrulandı; "Serbestiyet başlangıç yılı" doğrulanacak | Özgeçmiş + Wikipedia |
| 10 video/ses kaydının başlık, tarih, program adı | ✅ doğrulandı | serbestiyet.com |
| YouTube kimlikleri | ⏳ eklenecek (alanı doldurmak yeterli) | — |
| Yazıların tam metinleri | ⏳ aktarılacak | — |
| Radar notları | ⚠️ **örnek**: eserler gerçek, yorumlar Berktay'ın değil | — |
| "Bir Dönem Kapanırken" özeti | ⚠️ taslak, doğrulanacak | — |

## Dosya yapısı

```
app/            sayfalar (/, /arsiv, /yazilar/[slug], /kitaplar/[slug], /videolar/[slug], /radar, /biyografi, /hakkinda)
components/     CommandPalette (⌘K), ArchiveExplorer, ReaderTools, BookCover, VideoFrame, CinemaModal, Timeline…
data/           articles, books, videos, radar, timeline, topics
lib/            types (şema), content (birleşik indeks), search, format
```
