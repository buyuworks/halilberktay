/* ------------------------------------------------------------------
   VERİ ŞEMASI
   Tüm içerik bu tiplerle tanımlanır. İleride bir CMS'e (Sanity, Payload,
   Strapi) veya Postgres'e taşındığında aynı şema korunur.
------------------------------------------------------------------- */

export type TopicId =
  | "erken-cumhuriyet"
  | "osmanli"
  | "osmanli-iktisat"
  | "solun-tarihi"
  | "devrimler"
  | "guncel-siyaset"
  | "feodalizm-atut"
  | "tarih-yazimi"
  | "milliyetcilik"
  | "somurgecilik"
  | "kultur"
  | "kurt-meselesi"
  | "dunya-siyaseti"
  | "ortacag";

export type Source =
  | "Serbestiyet"
  | "Serbestiyet in English"
  | "Taraf"
  | "Toplum ve Bilim"
  | "Birikim"
  | "Tarih ve Toplum"
  | "Journal of Peasant Studies"
  | "Periplus"
  | "Kitap Bölümü";

export type ContentType = "Makale" | "Video" | "Ses Kaydı" | "Kitap" | "Radar";

export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  /** Tam metin. Yoksa okuyucu özet + kaynak bağlantısı gösterir. */
  content?: ArticleBlock[];
  publishedAt: string; // ISO yyyy-mm-dd (yalnızca yıl biliniyorsa yyyy-01-01 + datePrecision)
  datePrecision?: "day" | "month" | "year";
  source: Source;
  kind: "Köşe Yazısı" | "Akademik Makale" | "Kitap Bölümü";
  tags: TopicId[];
  readingTime: number; // dakika
  externalUrl?: string;
  /** Berktay sıklıkla numaralı yazı dizileri yazar — dizi gezgini için */
  series?: { id: string; part: number; /** kaynaktaki bölüm etiketi (ör. "14b", "EN 1"); yoksa part */ label?: string };
  /** Metin dili (varsayılan Türkçe) */
  language?: "en";
  /** Akademik künye (dergi, cilt, sayfa) */
  citation?: string;
}

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string; id: string }
  | { type: "quote"; text: string };

export interface ArticleSeries {
  id: string;
  title: string;
  description: string;
}

export type VideoSeriesId =
  | "herkes-icin-sosyal-bilim"
  | "solun-kultur-seruveni"
  | "guncellikten-tarihe"
  | "serbestiyet-tartismalari"
  | "serbestpod"
  | "konferans-seminer"
  | "tv-programlari";

export interface Video {
  id: string;
  title: string;
  slug: string;
  /** YouTube kimliği. null ise oynatıcı "kimlik bekleniyor" durumunu gösterir. */
  youtubeId: string | null;
  embedUrl: string | null;
  series: VideoSeriesId;
  medium: "Video" | "Ses Kaydı";
  publishedAt: string;
  duration: string | null;
  tags: TopicId[];
  summary: string;
  sourceUrl?: string;
  part?: number;
}

export interface VideoSeries {
  id: VideoSeriesId;
  title: string;
  platform: string;
  description: string;
}

export interface Book {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  englishTitle?: string;
  publisher: string;
  year: number;
  editions?: { publisher: string; year: number; note?: string }[];
  /** Gerçek kapak taranana kadar tipografik kapak üretilir */
  coverImage: string | null;
  description: string;
  role: "Yazar" | "Ortak Yazar" | "Editör" | "Çevirmen" | "Dizi Editörü";
  contributors?: string;
  tags: TopicId[];
  language: "tr" | "en";
}

export type RadarCategory = "Kitap" | "Makale" | "Video" | "Gündem";

export interface RadarItem {
  id: string;
  date: string;
  itemTitle: string;
  itemSource: string;
  author?: string;
  externalUrl: string;
  berktayComment: string;
  category: RadarCategory;
  tags?: TopicId[];
  /** true: Berktay'ın gerçek notu değil, tasarım için yer tutucu */
  placeholder?: boolean;
}

export interface TimelineEvent {
  year: number;
  endYear?: number;
  title: string;
  place?: string;
  kind: "Eğitim" | "Akademi" | "Yayın" | "Kamusal" | "Burs";
  detail?: string;
}
