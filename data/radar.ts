import type { RadarItem } from "@/lib/types";

/* ------------------------------------------------------------------
   ENTELEKTÜEL RADAR — "Bugünlerde masamda"
   ÖNEMLİ: Aşağıdaki notların TAMAMI tasarım için yazılmış yer tutucudur
   (placeholder: true). Yalnız gerçek eserler bırakıldı (uydurma başlıklar 26 Kasım 2026'da
   çıkarıldı); yorum alanları bilerek boş
   bırakıldı (uydurma yorum yazılmaz). Yayına geçerken bu akış bir CMS / mobil kısa form üzerinden
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
    berktayComment: "",
    tags: ["ortacag", "feodalizm-atut"],
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
    berktayComment: "",
    tags: ["tarih-yazimi", "ortacag"],
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
    berktayComment: "",
    tags: ["feodalizm-atut", "osmanli"],
    placeholder: true,
  },
];
