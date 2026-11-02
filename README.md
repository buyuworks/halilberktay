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
| 864 Serbestiyet köşe yazısı, 2014–2026 (başlık, tarih, bağlantı, kısa özet) | ✅ yazar arşivinin 29 sayfasının tamamı | serbestiyet.com yazar sayfası (`data/raw/`) |
| 60+ yazı dizisi, bölüm sıraları | ✅ başlıklardan çıkarıldı; bazı bölümler sitede yok (aşağıda) | `scripts/build-serbestiyet.mjs` |
| Konu etiketleri | ⚠️ anahtar kelimeyle otomatik; editör kontrolü gerekli | `TOPIC_RULES` |
| Taraf yazıları (2007–2013) | ⏳ dizinlenmedi | — |
| 15 akademik makale / kitap bölümü künyesi | ✅ doğrulandı | İbn Haldun Üniv. özgeçmişi |
| 13 kitap | ✅ doğrulandı (2010 sonrası eksik olabilir) | Özgeçmiş + Wikipedia |
| Biyografi zaman çizelgesi | ✅ doğrulandı; Serbestiyet başlangıcı 2014 (arşivdeki en eski yazı 1 Ocak 2014) | Özgeçmiş + Wikipedia |
| 10 video/ses kaydının başlık, tarih, program adı | ✅ doğrulandı | serbestiyet.com |
| YouTube kimlikleri | ⏳ eklenecek (alanı doldurmak yeterli) | — |
| Yazıların tam metinleri | ⏳ aktarılacak | — |
| Radar notları | ⚠️ **örnek**: eserler gerçek, yorumlar Berktay'ın değil | — |
| "Bir Dönem Kapanırken" özeti | ⚠️ taslak, doğrulanacak | — |
| 5 yazının yalnızca ay bilgisi var | ⚠️ "Ara 2018" gibi gösteriliyor | site taşıma tarihi (2020-05-28) güvenilmez |

**Sitede bulunamayan dizi bölümleri:** Solun Kültür Serüveni yazı dizisinin 1–3. bölümleri, Kuvayı milliyeler (2), YAE (1), Putin ve Prigozhin (1).

### Serbestiyet verisini yeniden üretmek

```bash
# data/raw/*.psv dosyalarına yeni satır ekleyin: tarih | başlık | url | özet
node scripts/build-serbestiyet.mjs   # → data/serbestiyet-arsiv.ts
npm run build
```
Betik yazı kimliğine göre tekrarları ayıklar, dizileri (`SERIES` kuralları) ve İngilizce çevirileri ("EN 1, EN 2…") tanır, konu etiketlerini atar. Elle düzenlenen yazılar `data/articles.ts` içindedir ve üretilen dosyada atlanır.

## Dosya yapısı

```
app/            sayfalar (/, /arsiv, /yazilar, /yazilar/[slug], /yazilar/yil/[yil], /konular/[konu], /kitaplar/[slug], /videolar/[slug], /radar, /biyografi, /hakkinda)
                /arama-dizini.json: ⌘K ve arşiv için ayrı arama dizini (≈90 KB gzip, ilk açılışta yüklenir)
components/     CommandPalette (⌘K), ArchiveExplorer, ReaderTools, BookCover, VideoFrame, CinemaModal, Timeline…
data/           articles (elle), serbestiyet-arsiv (üretilen), books, videos, radar, timeline, topics
data/raw/       Serbestiyet yazar arşivinden çekilen ham satırlar
scripts/        build-serbestiyet.mjs, parse-raw.mjs
lib/            types (şema), content (birleşik indeks), search, format
```
