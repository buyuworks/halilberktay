import type { Video, VideoSeries } from "@/lib/types";

/* ------------------------------------------------------------------
   VİDEO VE SES KAYITLARI
   Başlık, tarih ve program adları serbestiyet.com'daki sayfalardan
   doğrulandı. YouTube kimlikleri (youtubeId) henüz girilmedi: oynatıcı
   bu durumda kaynağa yönlendirir. Kimlik eklendiği anda gömülü oynatıcı
   kendiliğinden çalışır.
------------------------------------------------------------------- */

export const VIDEO_SERIES: VideoSeries[] = [
  {
    id: "herkes-icin-sosyal-bilim",
    title: "Tırnak İçinde · #HerkesİçinSosyalBilim",
    platform: "YouTube",
    description: "Sosyal bilimin temel kavramlarını geniş kitleye açan anlatım dizisi.",
  },
  {
    id: "solun-kultur-seruveni",
    title: "Solun Kültür Serüveni",
    platform: "Serbestiyet TV",
    description:
      "Türkiye solunun kültürünün nasıl oluştuğu, değiştiği ve tarihe karıştığı üzerine anlatım dizisi (2024).",
  },
  {
    id: "guncellikten-tarihe",
    title: "Güncellikten Tarihe, Tarihten Güncelliğe",
    platform: "Serbestiyet TV",
    description: "Gündemdeki bir olaydan tarihsel derinliğe inen haftalık program.",
  },
  {
    id: "serbestiyet-tartismalari",
    title: "Serbestiyet Tartışmaları",
    platform: "Serbestiyet TV",
    description: "Katılımcılarla canlı tartışma programı.",
  },
  {
    id: "serbestpod",
    title: "SerbestPod",
    platform: "Podcast",
    description: "Serbestiyet'in podcast yayınları: Ne Oluyor? ve özel bölümler.",
  },
  {
    id: "konferans-seminer",
    title: "Konferans ve Seminerler",
    platform: "Çeşitli",
    description: "Vakıf, üniversite ve kongrelerde verilen konuşmalar.",
  },
  {
    id: "tv-programlari",
    title: "TV Programları",
    platform: "Televizyon",
    description: "Ulusal kanallarda konuk olunan programlar.",
  },
];

export const VIDEOS: Video[] = [
  {
    id: "v-162565",
    slug: "solun-kultur-seruveni-3",
    title: "Büyük dâvâların gölgesinde",
    youtubeId: null,
    embedUrl: null,
    series: "solun-kultur-seruveni",
    part: 3,
    medium: "Video",
    publishedAt: "2024-04-06",
    duration: null,
    tags: ["solun-tarihi", "kultur", "devrimler"],
    summary:
      "Kültür, daha geniş tarihsel bağlam değişince değişir. Aydınlanma, Fransız ve Bolşevik devrimleri, faşizm, Soğuk Savaş ve sömürgecilik karşıtı mücadeleler Türkiye solunu nasıl biçimlendirdi?",
    sourceUrl: "https://serbestiyet.com/?p=162565",
  },
  {
    id: "v-162366",
    slug: "solun-kultur-seruveni-2",
    title: "Kültüre nasıl bakmalı?",
    youtubeId: null,
    embedUrl: null,
    series: "solun-kultur-seruveni",
    part: 2,
    medium: "Video",
    publishedAt: "2024-04-04",
    duration: null,
    tags: ["kultur", "solun-tarihi"],
    summary:
      "Kültür yalnızca bir siyasal iktidar alanı olarak mı görülmeli? Mevcut kültür politikalarına karşı çıkmak, yeni bir kültür kurmaya yetmez.",
    sourceUrl:
      "https://serbestiyet.com/video-haber/solun-kultur-seruveni-2-halil-berktay-anlatiyor-kulture-nasil-bakmali-162366/",
  },
  {
    id: "v-161728",
    slug: "solun-kultur-seruveni-1",
    title: "Değişimi kabullenme sorunu",
    youtubeId: null,
    embedUrl: null,
    series: "solun-kultur-seruveni",
    part: 1,
    medium: "Video",
    publishedAt: "2024-03-30",
    duration: null,
    tags: ["kultur", "solun-tarihi", "erken-cumhuriyet"],
    summary:
      "İster 1908'den ister 1923'ten başlatın, bir siyasal ve kültürel paradigma sona erdi. Çare makul bir demokratik merkezde ve kültürel melezleşmede.",
    sourceUrl:
      "https://serbestiyet.com/featured/solun-kultur-seruveni-1-halil-berktay-ister-1908den-ister-1923den-baslatin-bir-siyasal-ve-kulturel-paradigma-sona-erdi-tukendi-care-kulturel-melezlesmede-161728/",
  },
  {
    id: "v-196737",
    slug: "demokraside-deprem-trump-amerika-ve-dunya",
    title: "Demokraside deprem: Trump, Amerika ve dünya",
    youtubeId: null,
    embedUrl: null,
    series: "serbestiyet-tartismalari",
    medium: "Video",
    publishedAt: "2025-02-12",
    duration: null,
    tags: ["dunya-siyaseti", "guncel-siyaset"],
    summary: "Halil Berktay ve Av. Yunus Emre Erdölen, katılımcılarla birlikte Trump sonrası demokrasinin krizini tartışıyor.",
    sourceUrl:
      "https://serbestiyet.com/featured/halil-berktay-ve-yunus-emre-erdolen-katilimcilarla-tartisiyor-demokraside-deprem-trump-amerika-ve-dunya-196737/",
  },
  {
    id: "v-107465",
    slug: "yigit-katiller-sehit-iskenceciler",
    title: "Yiğit katiller, şehit işkenceciler…",
    youtubeId: null,
    embedUrl: null,
    series: "guncellikten-tarihe",
    medium: "Video",
    publishedAt: "2022-10-19",
    duration: null,
    tags: ["guncel-siyaset", "solun-tarihi"],
    summary:
      "\"Bizimkilerin haklı şiddeti\" fikri üzerine: Türkiye'nin, her taraftan şiddeti kınayan bir siyasal kültüre ihtiyacı var.",
    sourceUrl: "https://serbestiyet.com/video-haber/yigit-katiller-sehit-iskenceciler-107465/",
  },
  {
    id: "v-89398",
    slug: "kultur-ve-sanata-ideolojik-mudahalenin-felaketi",
    title: "Kültür ve sanata ideolojik müdahalenin felaketi",
    youtubeId: null,
    embedUrl: null,
    series: "konferans-seminer",
    medium: "Video",
    publishedAt: "2022-04-11",
    duration: null,
    tags: ["kultur", "solun-tarihi"],
    summary:
      "Bilim ve Sanat Vakfı semineri: Sosyalizm tecrübesinin öğretebilecekleri. Sovyetler Birliği ve Çin'de kültür politikaları.",
    sourceUrl: "https://serbestiyet.com/haberler/video-haber-kultur-ve-sanata-ideolojik-mudahalenin-felaketi-89398",
  },
  {
    id: "v-64792",
    slug: "gonul-cografyamiz-vav-tv",
    title: "Tarih kavramı, felsefe, siyaset ve edebiyat",
    youtubeId: null,
    embedUrl: null,
    series: "tv-programlari",
    medium: "Video",
    publishedAt: "2021-07-07",
    duration: null,
    tags: ["tarih-yazimi", "kultur"],
    summary:
      "VAV TV, Gönül Coğrafyamız (sunan: Veysi Baysan). Tarih kavramı, tarihin felsefe, siyaset ve edebiyatla ilişkisi, modern ve postmodern toplumlarda tarih bilgisinin önemi.",
    sourceUrl: "https://serbestiyet.com/?p=64792",
  },
  {
    id: "v-54852",
    slug: "bugun-olanlar-1925-1927-arasina-benziyor",
    title: "Bugün olanlar 1925–1927 arasına benziyor",
    youtubeId: null,
    embedUrl: null,
    series: "serbestpod",
    medium: "Ses Kaydı",
    publishedAt: "2021-03-24",
    duration: null,
    tags: ["guncel-siyaset", "erken-cumhuriyet"],
    summary:
      "SerbestPod · Ne Oluyor? HDP kapatma davası, İstanbul Sözleşmesi'nden çekilme ve Merkez Bankası başkanının görevden alınması tarihsel bir çerçevede.",
    sourceUrl: "https://serbestiyet.com/haberler/bugun-olanlar-1925-1927-arasina-benziyor-54852",
  },
  {
    id: "v-54386",
    slug: "halil-berktay-mehmet-genci-anlatiyor",
    title: "Mehmet Genç'i anlatıyor",
    youtubeId: null,
    embedUrl: null,
    series: "serbestpod",
    medium: "Ses Kaydı",
    publishedAt: "2021-03-19",
    duration: null,
    tags: ["osmanli-iktisat", "tarih-yazimi"],
    summary: "18 Mart 2021'de kaybettiğimiz iktisat tarihçisi Mehmet Genç'in entelektüel mirası, bir dostun gözünden.",
    sourceUrl: "https://serbestiyet.com/?p=54386",
  },
  {
    id: "v-3687",
    slug: "tarihin-anlami-ve-onemi-haber-global",
    title: "Tarihin anlamı ve önemi",
    youtubeId: null,
    embedUrl: null,
    series: "tv-programlari",
    medium: "Video",
    publishedAt: "2019-08-13",
    duration: "2 sa",
    tags: ["tarih-yazimi"],
    summary: "Haber Global bayram özel yayını (sunan: Emre Dorman). Tarih ve tarih yazımı zanaatı üzerine sohbet.",
    sourceUrl: "https://serbestiyet.com/?p=3687",
  },
];
