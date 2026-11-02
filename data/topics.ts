import type { TopicId, Source, ContentType } from "@/lib/types";

export const TOPICS: Record<TopicId, { label: string; short?: string; description: string }> = {
  "erken-cumhuriyet": {
    label: "Erken Cumhuriyet",
    description: "1919–1950: Milli Mücadele, tek parti dönemi, resmî tarih tezinin inşası.",
  },
  osmanli: {
    label: "Osmanlı Tarihi",
    description: "Kuruluştan dağılmaya, uzun 19. yüzyıl ve Tanzimat dahil.",
  },
  "osmanli-iktisat": {
    label: "Osmanlı İktisat Tarihi",
    short: "İktisat Tarihi",
    description: "Tımar, vergi-rant tartışması, köylülük ve devlet.",
  },
  "solun-tarihi": {
    label: "Solun Tarihi",
    description: "Türkiye ve dünya solunun siyasi ve kültürel serüveni.",
  },
  devrimler: {
    label: "Devrimler Çağı",
    description: "Fransız, Amerikan, Bolşevik devrimleri ve devrim fetişizmi.",
  },
  "guncel-siyaset": {
    label: "Güncel Siyaset",
    description: "Tarihçi gözüyle bugünün Türkiyesi.",
  },
  "feodalizm-atut": {
    label: "Feodalizm / ATÜT",
    description: "Asya Tipi Üretim Tarzı tartışması ve 'öteki' feodalizm.",
  },
  "tarih-yazimi": {
    label: "Tarih Yazımı ve Yöntem",
    short: "Tarih Yazımı",
    description: "Tarihçilik, historiyografi, bilim ve yöntem üzerine.",
  },
  milliyetcilik: {
    label: "Milliyetçilik",
    description: "Ulusal tarih yazımı, resmî ideoloji ve ulus inşası.",
  },
  somurgecilik: {
    label: "Sömürgecilik ve Emperyalizm",
    short: "Sömürgecilik",
    description: "Ulusal kurtuluş kavramı, sömürgecilik ve imparatorluklar.",
  },
  kultur: {
    label: "Kültür",
    description: "Kültür politikası, edebiyat, sanat ve ideoloji.",
  },
  "kurt-meselesi": {
    label: "Kürt Meselesi",
    description: "Silahlı mücadele, barış süreçleri ve sol.",
  },
  "dunya-siyaseti": {
    label: "Dünya Siyaseti",
    description: "ABD, Avrupa ve küresel demokrasi krizi.",
  },
  ortacag: {
    label: "Ortaçağ",
    description: "Batı ve Türk ortaçağ tarihçiliği, Marc Bloch, köylülük.",
  },
};

export const TOPIC_IDS = Object.keys(TOPICS) as TopicId[];

export const SOURCES: Record<Source, { description: string; years: string }> = {
  Serbestiyet: { description: "Köşe yazıları, yazı dizileri ve video programları", years: "2014–" },
  "Serbestiyet in English": { description: "Notes on History and Culture", years: "2021–" },
  Taraf: { description: "Köşe yazıları (Weimar Türkiyesi, Özgürlük Dersleri)", years: "2007–2013" },
  "Toplum ve Bilim": { description: "Akademik makaleler", years: "1981–1991" },
  Birikim: { description: "Sosyalist kültür dergisi", years: "1989–1993" },
  "Tarih ve Toplum": { description: "Aylık tarih dergisi", years: "1986" },
  "Journal of Peasant Studies": { description: "Uluslararası hakemli dergi", years: "1987" },
  Periplus: { description: "Almanca yıllık", years: "1991" },
  "Kitap Bölümü": { description: "Derleme kitaplardaki bölümler", years: "1985–2005" },
};

export const CONTENT_TYPES: ContentType[] = ["Makale", "Video", "Ses Kaydı", "Kitap", "Radar"];
