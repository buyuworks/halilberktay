import type { RadarItem } from "@/lib/types";

/* ------------------------------------------------------------------
   ENTELEKTÜEL RADAR — "Bugünlerde masamda"
   ÖNEMLİ: Aşağıdaki notların TAMAMI tasarım için yazılmış yer tutucudur
   (placeholder: true). Eserler gerçektir; yorumlar Halil Berktay'a ait
   değildir. Yayına geçerken bu akış bir CMS / mobil kısa form üzerinden
   Berktay'ın kendisi tarafından beslenecek.
------------------------------------------------------------------- */

export const RADAR: RadarItem[] = [
  {
    id: "r-01",
    date: "2026-10-30",
    category: "Kitap",
    itemTitle: "The Donkey and the Boat: Reinterpreting the Mediterranean Economy, 950–1180",
    author: "Chris Wickham",
    itemSource: "Oxford University Press, 2023",
    externalUrl: "https://en.wikipedia.org/wiki/Chris_Wickham",
    berktayComment:
      "Doktora danışmanımın Akdeniz ekonomisine dair büyük sentezi. Mısır, İfrikiye, Sicilya, Bizans… Karşılaştırmalı iktisat tarihinin nasıl yazılacağına dair bir ders.",
    tags: ["ortacag", "feodalizm-atut"],
    placeholder: true,
  },
  {
    id: "r-02",
    date: "2026-10-27",
    category: "Makale",
    itemTitle: "Lozan'ın yüz yıl sonrası: Nüfus mübadelesi üzerine yeni arşiv çalışmaları",
    itemSource: "Örnek dergi başlığı",
    externalUrl: "https://en.wikipedia.org/wiki/Population_exchange_between_Greece_and_Turkey",
    berktayComment:
      "\"Birbirinden habersiz iki düşman kardeş\" yazımla birlikte okunmalı. İki ulusal anlatının birbirini nasıl görmezden geldiğinin belgeleri.",
    tags: ["erken-cumhuriyet", "milliyetcilik"],
    placeholder: true,
  },
  {
    id: "r-03",
    date: "2026-10-22",
    category: "Kitap",
    itemTitle: "Apologie pour l'histoire ou Métier d'historien",
    author: "Marc Bloch",
    itemSource: "Yeniden okuma · Tarihçinin Zanaatı",
    externalUrl: "https://en.wikipedia.org/wiki/The_Historian%27s_Craft",
    berktayComment:
      "Öğrencilerle her dönem yeniden açtığım kitap. Bloch'un tamamlayamadan kurşuna dizildiği bu metin, tarihçinin şüphe ile merak arasındaki dengesini hâlâ en iyi anlatan eser.",
    tags: ["tarih-yazimi", "ortacag"],
    placeholder: true,
  },
  {
    id: "r-04",
    date: "2026-10-18",
    category: "Gündem",
    itemTitle: "Avrupa'da aşırı sağın yükselişi ve 1930'lar analojisinin sınırları",
    itemSource: "Dünya basını derlemesi",
    externalUrl: "https://en.wikipedia.org/wiki/Weimar_Republic",
    berktayComment:
      "\"Weimar Türkiyesi\"ni yazdığımda da sorduğum soru: tarihsel analoji ne zaman aydınlatır, ne zaman tembelliğe dönüşür?",
    tags: ["dunya-siyaseti", "guncel-siyaset"],
    placeholder: true,
  },
  {
    id: "r-05",
    date: "2026-10-12",
    category: "Video",
    itemTitle: "Eric Hobsbawm on the Age of Extremes",
    itemSource: "Arşiv röportajı",
    externalUrl: "https://en.wikipedia.org/wiki/The_Age_of_Extremes",
    berktayComment:
      "Hobsbawm'ı Türkçe okura sunarken (Birikim, 1993) altını çizdiğim şey: Bir Marksistin yüzyılın büyük hatalarına bakabilme cesareti.",
    tags: ["solun-tarihi", "tarih-yazimi"],
    placeholder: true,
  },
  {
    id: "r-06",
    date: "2026-10-05",
    category: "Kitap",
    itemTitle: "Lineages of the Absolutist State",
    author: "Perry Anderson",
    itemSource: "Verso · Yeniden okuma",
    externalUrl: "https://en.wikipedia.org/wiki/Lineages_of_the_Absolutist_State",
    berktayComment:
      "Osmanlı'yı \"Doğu despotizmi\" kutusuna koyan bölümleriyle tartışmaya devam ettiğim klasik. Vergi–rant tartışmasının arka planı.",
    tags: ["feodalizm-atut", "osmanli"],
    placeholder: true,
  },
];
