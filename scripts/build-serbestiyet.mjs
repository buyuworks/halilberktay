// Serbestiyet yazar sayfasından çıkarılan ham indeksi (data/raw/*) tipli bir veri
// dosyasına dönüştürür: data/serbestiyet-arsiv.ts
//   node scripts/build-serbestiyet.mjs
// Başlık, tarih ve bağlantılar kaynaktaki gibidir. Özetler editoryal kısa notlardır.
// Diziler: başlıktaki numaradan (ör. "Ruhumuzdaki şeytan (7)") ya da elle
// tanımlanmış yazı kimliği listelerinden belirlenir. Konu etiketleri anahtar
// kelimelerden üretilir; editoryal gözden geçirme gerektirir.
import fs from "node:fs";
import path from "node:path";
import { loadRaw } from "./parse-raw.mjs";

const root = path.join(path.dirname(new URL(import.meta.url).pathname), "..");

// ——— Türkçe katlama (lib/format.ts ile aynı)
const fold = (s) =>
  s.toLocaleLowerCase("tr").replace(/[âà]/g, "a").replace(/[îı]/g, "i").replace(/[ûü]/g, "u")
    .replace(/ö/g, "o").replace(/ç/g, "c").replace(/ş/g, "s").replace(/ğ/g, "g");

// ——— Diziler
// match: başlık için düzenli ifade; ilk yakalanan grup bölüm etiketi olur
// pids: başlığında dizi adı geçmeyen bölümler { yazıKimliği: "etiket" }
// editorial: dizi adı kaynakta yok, arşiv tarafından verildi
const SERIES = [
  { id: "solun-kultur-seruveni-yazi", title: "Solun Kültür Serüveni (yazı dizisi)", desc: "Aynı adlı video dizisinin yazılı karşılığı: itaat ve itiraz, Fransız Devrimi, Marksizm, emperyalizm ve imparatorluklar.", match: /^Solun Kültür Serüveni\s+(\d+[ab]?)/, tags: ["solun-tarihi", "devrimler"] },
  { id: "ucuncu-dunya-savasi", title: "Üçüncü Dünya Savaşı", desc: "7 Ekim sonrası Ortadoğu, kör milliyetçilik, anti-semitizmin tarihi ve Siyonizm üzerine yedi bölüm.", match: /^Üçüncü Dünya Savaşı \((\d+)\)/, pids: { 178200: "5", 178462: "6", 178848: "7" }, tags: ["dunya-siyaseti", "milliyetcilik"] },
  { id: "kuvayi-milliyeler", title: "Yeryüzünün bütün kuvayı milliyeleri", desc: "Eşkıyalıktan kuvayı milliyelere, Makedonya'dan Hamas'a düzensiz kuvvetler ve Millî Mücadele. (Dizi adı ilk bölümden alınmıştır; 2. bölüm arşivde bulunamadı.)", editorial: true, pids: { 165219: "1", 167713: "3", 168253: "4", 169174: "5", 169916: "6", 171004: "7", 171738: "7a" }, tags: ["erken-cumhuriyet", "milliyetcilik"] },
  { id: "putin-prigozhin", title: "Putin ve Prigozhin", desc: "Wagner isyanı vesilesiyle devlet, şiddet ve Batı düşmanlığı.", match: /^Putin ve Prigozhin \((\d+)\)/, tags: ["dunya-siyaseti"] },
  { id: "perincek-fenomeni", title: "Perinçek fenomeni", desc: "Bir siyasi figürün kendini kurgulayışı üzerine üç yazı.", match: /^Perinçek fenomeni \((\d+)\)/, tags: ["solun-tarihi", "guncel-siyaset"] },
  { id: "terakki", title: "Terakki", desc: "İlerleme fikri: Nâzım'ın iyimserliğinden kral kroniklerine ve modern köylü kroniklerine.", match: /^Terakki \((\d+)\)/, tags: ["tarih-yazimi", "kultur"] },
  { id: "vietnam", title: "Vietnam", desc: "Devrim sonrası modern saltanat rejimleri ve demokrasisiz yarı-kapitalizm.", match: /^Vietnam \((\d+)\)/, tags: ["devrimler", "dunya-siyaseti"] },
  { id: "fas-fransa", title: "Fas-Fransa maçı", desc: "2022 Dünya Kupası yarı finali üzerinden emperyalizm ve yeni Avrupa.", match: /^Fas-Fransa maçı \((\d+)\)/, tags: ["somurgecilik", "dunya-siyaseti"] },
  { id: "zor-zanaat", title: "Tarihçilik de zor zanaat", desc: "Mommsen, Prusya militarizmi ve 'kazanana biat': Prusya tipi ülkelerde tarihçilik.", match: /^Zor zanaat \((\d+)\)/, pids: { 109838: "1" }, tags: ["tarih-yazimi"] },
  { id: "avrasyacilik", title: "Avrasyacılık", desc: "Demokrasiden kurtulma özlemi, çağımızın faşizmi ve Putin'in takıntıları.", match: /^Avrasyacı(?:lık|ların özlemi) \((\d+)\)/, tags: ["dunya-siyaseti", "milliyetcilik"] },
  { id: "gunumuzun-karanligi", title: "Günümüzün karanlığı", desc: "Demokrasinin buhranından Ukrayna işgaline dört yazı.", match: /^Günümüzün karanlığı \((\d+)\)/, tags: ["dunya-siyaseti"] },
  { id: "yae-dusmanligi", title: "YAE düşmanlığı", desc: "Entelektüel sektarizm, ermişlik arayışı ve Marx'tan reform dersleri.", match: /^YAE(?: düşmanlığı)? \((\d+)\)/, tags: ["solun-tarihi"] },
  { id: "dis-korkusu", title: "\"Dış\" korkusu", desc: "Kuzey Kore'den Osmanlı'ya milliyetçilik, kudsiyet ve günah keçisi üzerine on dört bölüm.", match: /korkusu \((\d+)\)/, tags: ["milliyetcilik"] },
  { id: "bir-soruya-cevap", title: "Bir soruya cevap: tarihte cinsellik", desc: "Eski Yunan'dan Japonya'ya mekânsal ayrışma ve cinsellik; ardından üç ek not.", editorial: true, match: /^(?:Bir soruya cevap.*?\((\d+)\)|Bir soruya cevap \((\d+)\))/, extra: /^Ek notlar \((\d+)\)/, extraPrefix: "Ek ", tags: ["tarih-yazimi", "kultur"] },
  { id: "anadolu-babadolu", title: "Anadolu, Babadolu", desc: "İki yazı ve İngilizce çevirileri.", match: /^Anadolu, Babadolu \((\d+)\)/, extra: /^Anatolia \((\d+)\)/, extraPrefix: "EN ", tags: ["milliyetcilik", "tarih-yazimi"] },
  { id: "abd-secimleri-2020", title: "ABD seçimleri (2020)", desc: "Trump'ın yenilgisi, Trumpçı faşizm ve Türkiye'nin Trumpçıları.", match: /^ABD seçimleri \((\d+)\)/, tags: ["dunya-siyaseti"] },
  { id: "islami-bilim", title: "Ayrı bir \"İslâmî bilim\" olabilir mi", desc: "Doğa bilimleri, biyoloji ve iktisatta ayrı bir İslâmî bilim fikri.", match: /^Ayrı bir .İslâmî bilim. olabilir mi \((\d+)\)/, tags: ["tarih-yazimi", "kultur"] },
  { id: "gelmeyen-devrim", title: "Gelmeyen devrim", desc: "Ruşen Çakır vesilesiyle: düzen dışı fetişizmi, Lenin'den Guevara'ya devrimcilik, boykot ve devrim ikameleri. (Editoryal ad.)", editorial: true, pids: { 39894: "1", 39963: "2", 40028: "3", 40073: "4", 40166: "5", 40285: "6", 40565: "7", 40608: "8", 40701: "9", 40759: "10" }, tags: ["solun-tarihi", "devrimler"] },
  { id: "erkekler-kadinlar", title: "Erkekler ve kadınlar", desc: "Namus, şiddet dili, Duby ve Kuzey Avrupa'nın tuhaflığı.", match: /^Erkekler ve kadınlar \((\d+)\)/, tags: ["tarih-yazimi", "ortacag"] },
  { id: "osmanli-modernligi", title: "Osmanlı ne kadar moderndi", desc: "Oral Çalışlar'a yanıtla başlayan, tımar, feodalizm, ATÜT ve barut imparatorlukları üzerine on beş bölüm.", match: /^Osmanlı(?:nın modernliği| ne kadar moderndi) \((\d+)\)/, pids: { 37010: "7", 37058: "8", 37385: "12", 37522: "13" }, tags: ["osmanli", "osmanli-iktisat", "feodalizm-atut"] },
  { id: "kolombdan-once", title: "Kolomb'dan önce onlar vardı", desc: "Amerikan yerlileri, Wounded Knee, Dakota idamları ve tarihçinin sadakati.", editorial: true, pids: { 6441: "1a", 6459: "1b", 6517: "2", 6533: "3", 34526: "4", 34454: "5", 34442: "6", 34519: "7", 34551: "8", 34612: "9" }, tags: ["somurgecilik", "tarih-yazimi"] },
  { id: "gene-salgin", title: "Gene salgın", desc: "Dünya ve Türkiye hakkında salgın gözlemleri.", match: /^Gene salgın \((\d+)\)/, tags: ["guncel-siyaset"] },
  { id: "istifa-2020", title: "İstifa", desc: "Özgür irade, medya ve siyasi kültür.", match: /^İstifa \((\d+)\)/, tags: ["guncel-siyaset"] },
  { id: "uhuru-uluru", title: "Uhuru, Uluru", desc: "Avustralya'nın iskân tarihi ve kutsal kaya.", match: /^Uhuru, Uluru \((\d+)\)/, tags: ["somurgecilik"] },
  { id: "baskalarinin-aynasinda", title: "Başkalarının aynasında Türkiye", desc: "İtalyan taraftarlardan Bolsonaro'ya.", match: /^Başkalarının aynasında(?: Türkiye)? \((\d+)\)/, tags: ["dunya-siyaseti"] },
  { id: "ruhumuzdaki-seytan", title: "Ruhumuzdaki şeytan", desc: "Cadı avlarının tarihi: Ortaçağ kilisesinden Stalin'in tasfiyelerine, Mao'dan bugüne on altı bölüm.", match: /^Ruhumuzdaki şeytan \((\d+)\)/, tags: ["solun-tarihi", "devrimler", "ortacag"] },
  { id: "yargi-reformu", title: "Yargı Reformu", desc: "Bir görüşmeden notlar ve barış bildirisi imzacılarının durumu.", match: /^Yargı Reformu \((\d+)\)/, tags: ["guncel-siyaset"] },
  { id: "bekacilik", title: "\"Beka\"cılık ve kültürel etkileri", desc: "1990'larda genç Müslüman entelektüeller ve 28 Şubat.", match: /^.Beka.cılık ve kültürel etkileri \((\d+)\)/, tags: ["guncel-siyaset", "kultur"] },
  { id: "venezuela-2019", title: "Venezuela", desc: "Maduro'nun meşruiyeti, seçim tartışması ve emperyalizm.", editorial: true, pids: { 6005: "giriş", 5985: "güncel", 5941: "1" }, tags: ["dunya-siyaseti"] },
  { id: "bir-hukukcu", title: "Bir hukukçu", desc: "Carl Schmitt, Otto Thierack, Roland Freisler ve Andrey Vyshinsky: totaliter rejimlerin hukukçuları. (Editoryal gruplama.)", editorial: true, match: /^Bir hukukçu: /, tags: ["devrimler", "tarih-yazimi"] },
  { id: "marksizm-ve-ahlak", title: "Marksizm ve ahlâk", desc: "Apollon ve Dionysos'tan fraksiyon ahlâkına, Komintern'den kimlik inşasına on iki bölüm.", match: /^Marksizm ve ahlâk(?: sorunu)? \((\d+)\)/, pids: { 7162: "12" }, tags: ["solun-tarihi"] },
  { id: "pinokyo-odulleri", title: "Pinokyo ödülleri", desc: "Yılın yalanlarına üç ironik ödül.", match: /Pinokyo ödülleri.*?\((\d+)\)/, tags: ["dunya-siyaseti", "guncel-siyaset"] },
  { id: "ihtilal-hukuku", title: "\"İhtilâl hukuku\"", desc: "15 Temmuz sonrasının olağanüstü hukuku nasıl oluştu, nasıl çıkılır. (Editoryal ad.)", editorial: true, pids: { 8697: "1", 8683: "2", 8653: "3", 8638: "4" }, tags: ["guncel-siyaset", "devrimler"] },
  { id: "cohn-bendit", title: "Cohn-Bendit anlatıyor", desc: "1968'in ellinci yılında Daniel Cohn-Bendit.", match: /^Cohn-Bendit anlatıyor \((\d+)\)/, tags: ["solun-tarihi"] },
  { id: "sorular-2018", title: "Sorular: Türkiye nereye, Amerika ne yapmalı?", desc: "2002'den bugüne Türkiye ve yeni dünya düzeni.", match: /^Sorular \((\d+[ab]?)\)/, tags: ["guncel-siyaset", "dunya-siyaseti"] },
  { id: "yorunge-sohbetleri", title: "Yörünge dergisiyle sohbetler", desc: "Batı sorunu, medeniyet arayışı ve İslâmiyetin alternatifi üzerine dört bölümlük söyleşi.", match: /^Yörünge dergisiyle sohbetler \((\d+)\)/, tags: ["tarih-yazimi"] },
  { id: "tarihsel-dusunmek", title: "Nuh ve Tufan vesilesiyle, tarihsel düşünmek", desc: "Anakronizm ve 'bizim medeniyetimiz' üzerine üç yazı.", match: /arihsel düşünmek \((\d+)\)/, tags: ["tarih-yazimi"] },
  { id: "rusyada-demokrasi", title: "Rusya'da demokrasi ve demokratlık", desc: "Rusya'nın kısa demokrasi dönemleri ve bastırılan denemeler.", match: /^Rusya’da demokrasi ve demokratlık \((\d+)\)/, tags: ["dunya-siyaseti", "devrimler"] },
  { id: "post-truth", title: "Post-truth (gerçek sonrası)", desc: "Gerçek sonrası çağ, bağımsız yargı ve Osman Kavala.", match: /^Post-truth \(gerçek sonrası\) (\d+)/, tags: ["guncel-siyaset"] },
  { id: "nazi-dehseti", title: "Nazi dehşeti", desc: "Avrupa'nın çektikleri ve rejimin örgütlenişi.", match: /^Nazi dehşeti \((\d+)\)/, tags: ["tarih-yazimi", "dunya-siyaseti"] },
  { id: "teneke-trumpet", title: "Teneke Trump'et", desc: "Trump yönetiminin ilk ayları.", match: /^Teneke Trump’et \((\d+)\)/, tags: ["dunya-siyaseti"] },
  { id: "guney-afrika-notlari", title: "Güney Afrika notları", desc: "Değerler, çıkarlar ve apartheid.", match: /^Güney Afrika notları \((\d+)\)/, tags: ["somurgecilik"] },
  { id: "baskanlik-ara-nagme", title: "Başkanlık tartışması: ara nağmeler", desc: "Parlamenter sistem ve başkanlık sistemlerinin tarihsel kökleri. (Editoryal gruplama.)", editorial: true, pids: { 19286: "1", 19252: "2", 19226: "3", 19216: "4", 19114: "5" }, tags: ["guncel-siyaset", "tarih-yazimi"] },
  { id: "trump-dis-politika", title: "Trump'ın dış politikası", desc: "Belirsizlik, Çin ve Putin.", match: /^Trump’ın dış politikası \((\d+)\)/, tags: ["dunya-siyaseti"] },
  { id: "bilinmeyene-dogru", title: "Bilinmeyene doğru", desc: "Trump'ın 2016 zaferi ve sonrası.", match: /^Bilinmeyene doğru \((\d+)\)/, tags: ["dunya-siyaseti"] },
  { id: "siyaset-ve-ahlak", title: "Siyaset ve ahlâk", desc: "Külter'den Kant'a: ideoloji, gerçeğe mecburiyet ve yalan.", match: /^Siyaset ve ahlâk \((\d+)\)/, pids: { 21798: "3", 21760: "4" }, tags: ["solun-tarihi", "kurt-meselesi"] },
  { id: "devrim-sonrasi", title: "Tarihten \"devrim sonrası\" örnekleri", desc: "Lincoln ve Mustafa Kemal: zaferden sonra intikamsızlık.", match: /evrim sonrası.*?\((\d+)\)/, tags: ["devrimler", "erken-cumhuriyet"] },
  { id: "kurt-sorunu-2016", title: "Tekrar Kürt sorunu (2016)", desc: "İmralı'ya giden yol, edebiyatta Kürt savaşı ve 'Silâhların Tahtı'. (Editoryal gruplama.)", editorial: true, pids: { 22981: "1", 22897: "2", 22851: "3" }, tags: ["kurt-meselesi"] },
  { id: "soykirim-tartismasi-2016", title: "Soykırım tartışması (2016)", desc: "Devrimin yuttuğu alanlar ve solcuların yeni davaları.", editorial: true, pids: { 23479: "1", 23200: "2" }, tags: ["milliyetcilik", "solun-tarihi"] },
  { id: "onur-gecesi", title: "Onur gecesi", desc: "15 Temmuz 2016 gecesi yazılan üç yazı.", match: /^Onur gecesi \((\d+)\)/, tags: ["guncel-siyaset"] },
  { id: "kolombiya-2016", title: "Kolombiya ve bir tweet", desc: "Silahlı mücadeleden barışa: Kolombiya ve PKK.", editorial: true, pids: { 25159: "1", 25101: "2" }, tags: ["kurt-meselesi", "dunya-siyaseti"] },
  { id: "menderes-belgeseli", title: "Menderes belgeseli vesilesiyle", desc: "Bir belgesel üzerinden Tek Parti, 1946–60 demokrasisi, emperyalizm ve Yassıada üzerine on bölüm.", match: /(?:Menderes belgeseli|^Belgesel(?: vesilesiyle)?) \((\d+)\)/, tags: ["erken-cumhuriyet", "tarih-yazimi"] },
  { id: "baris-bildirisi-2016", title: "\"Olmayan\" savaşın \"barış\" bildirisi", desc: "Barış için Akademisyenler bildirisi, sol ve 'barış' geleneği. (Dizi adı ilk bölümden.)", editorial: true, pids: { 28245: "1", 27966: "2", 27846: "3", 27738: "4" }, tags: ["kurt-meselesi", "solun-tarihi"] },
  { id: "kaybolan-komiserler", title: "Resimler, çizgiler, kaybolan komiserler", desc: "Stalin döneminde fotoğraflardan silinenler. (Editoryal ad.)", editorial: true, pids: { 30296: "1", 30212: "2", 30126: "3" }, tags: ["solun-tarihi"] },
  { id: "bakur-rojava", title: "Bakur-Rojava yolunda", desc: "2015 sonu hendek siyaseti, PKK'nın savaş kararı ve İngilizce çevirileri.", match: /Bakur-Rojava.*?\((\d+)\)/, tags: ["kurt-meselesi"] },
  { id: "cifte-standart", title: "Çifte standarda sıfır tolerans", desc: "Geçmiş yazılar, Yenikapı ve Hürriyet saldırıları.", match: /^Çifte standarda sıfır tolerans \((\d+)\)/, tags: ["guncel-siyaset"] },
  { id: "surucun-ardindan", title: "Suruç'un ardından", desc: "Ortadoğu'nun Cenevre'si, PKK'nın yeni iç savaşı ve HDP ile tartışma.", match: /(?:^Suruç’un ardından|^In the wake of Suruç) \((\d+)\)/, tags: ["kurt-meselesi", "dunya-siyaseti"] },
  { id: "soykirim-paneli-2014", title: "Meaningful World soykırım paneli", desc: "1915'te ne oldu, inkâr inadı nereden geliyor, son engel nasıl aşılır.", match: /oykırım panelinde ?\((\d+)\)/, tags: ["osmanli", "milliyetcilik"] },
  { id: "kosullar-degisince", title: "Koşullar değişince", desc: "Ölümüne direnişten Collins ve Öcalan'a, İngiltere ve Türkiye.", match: /^Koşullar değişince \((\d+)\)/, pids: { 33749: "4" }, tags: ["kurt-meselesi", "tarih-yazimi"] },
  { id: "meger-2014", title: "Meğer", desc: "'Bir elitin ölümü'nün devamı: Gezi, yolsuzluk söylemi ve yeni HSYK.", match: /^Meğer (\d+)/, tags: ["guncel-siyaset"] },
];

// ——— Konu anahtar kelimeleri (katlanmış metin üzerinde)
const TOPIC_RULES = [
  ["osmanli", /osmanl|abdulhamit|tanzimat|ittihat|talat pasa|1915|soykirim|ermeni|inalcik|zachariadou|karpat/],
  ["osmanli-iktisat", /timar|fiyef|koylu toplum|vergi|rant/],
  ["feodalizm-atut", /feodal|asya uretim|aut\b|fut\b/],
  ["erken-cumhuriyet", /ataturk|mustafa kemal|kemalis|tek parti|1920|cumhuriyet|inonu|recep peker|milli mucadele|kuvayi|canakkale|menderes|yassiada|1946|dp’nin|tcf/],
  ["solun-tarihi", /marks|komunis|stalin|lenin|bolsevik|mao|sosyalis|solcu|\bsol\b|solun|nazim|troçki|trocki|buharin|komintern|devrimci|guevara|perincek/],
  ["devrimler", /devrim|fransiz|napolyon|robespierre|1789|1848|1968|68’|ihtilal/],
  ["milliyetcilik", /milliyetci|nasyonal|ulusalci|irkci|irkcilik|siyonizm|anti-semit|ulus /],
  ["somurgecilik", /somurge|emperyali|imparatorluk|yerli|apartheid|kolomb|lakota|dakota|afrika/],
  ["kurt-meselesi", /kurt|pkk|hdp|demirtas|ocalan|imrali|rojava|bakur|hendek|kobani|tahir elci|suruc|barzani/],
  ["kultur", /sanat|edebiyat|siir|roman|film|brecht|kipling|mayakovsk|nazim|yasar kemal|ahmet arif|ahmed arif|botticelli|borges|muzik|futbol|spor|spiker/],
  ["tarih-yazimi", /tarihci|tarih yaz|tarihsel|anakroni|olgu ve yorum|historiy|paradigma|kuhn|tarih ve siyaset|tarihe bir not/],
  ["dunya-siyaseti", /trump|biden|abd|amerika|putin|rusya|cin\b|cin’|cin ve|iran|israil|netanyahu|hamas|gazze|avrupa|brexit|ingiltere|almanya|fransa|macaristan|orban|venezuela|myanmar|bolsonaro|brezilya|ukrayna|suud|hindistan|kolombiya|vietnam|irak|suriye|isid|isid|bbc|fox news/],
  ["ortacag", /ortacag|kilise|cadi|iskender|ilkcag|helenistik|pirus|antik/],
  ["guncel-siyaset", /erdogan|akp|ak parti|chp|kilicdaroglu|davutoglu|imamoglu|secim|referandum|baskanlik|15 temmuz|darbe|yargi|hsyk|ysk|aym|kavala|gezi|ohal|salgin|korona|covid|soylu|gul\b|babacan|bildiri|medya|kutuplasma/],
];

const EN_WORDS = /\b(the|of|and|to|in|is|was|my|about|what|with|after|before|on|for|from|can|be|had|me|how|matters|stand|reply|friends|abroad|genocide|coup|lie|lunch)\b/i;
const EN_EXACT = new Set(["Liar", "Monsters", "Fair justice", "Under bombardment", "Pure fiction", "A new beginning"]);
const isEnglish = (t) => {
  if (EN_EXACT.has(t) || /^(In the wake of|Kyrgios and)/.test(t)) return true;
  if (/[çğıöşüâîûÇĞİÖŞÜ]/.test(t)) return false;
  const words = t.toLowerCase().replace(/[“”"()?,:.*]/g, " ").split(/\s+/);
  return words.some((w) => EN_WORDS.test(w) && EN_WORDS.exec(w)[0] === w) && !words.some((w) => ["ve", "bir", "ile", "mi", "ne", "da", "de"].includes(w));
};

function slugify(s) {
  return fold(s).replace(/[’'“”"()*,:;!?.…–—\/]/g, " ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80).replace(/-+$/, "");
}

const curatedPids = new Set(
  [...fs.readFileSync(path.join(root, "data/articles.ts"), "utf8").matchAll(/id: "a-(\d+)"/g)].map((m) => +m[1]),
);

const rows = loadRaw().filter((r) => !curatedPids.has(r.pid));
const slugs = new Set([...fs.readFileSync(path.join(root, "data/articles.ts"), "utf8").matchAll(/slug: "([^"]+)"/g)].map((m) => m[1]));

const seriesMembers = new Map(); // id -> [{row,label}]
function seriesFor(r) {
  for (const s of SERIES) {
    if (s.pids && s.pids[r.pid]) return { s, label: s.pids[r.pid] };
    if (s.match) {
      const m = r.title.match(s.match);
      if (m) return { s, label: m.slice(1).find(Boolean) ?? null };
    }
    if (s.extra) {
      const m = r.title.match(s.extra);
      if (m) return { s, label: s.extraPrefix + m[1] };
    }
  }
  return null;
}

const out = [];
for (const r of rows) {
  const precision = r.date.length === 7 ? "month" : "day";
  const date = precision === "month" ? `${r.date}-01` : r.date;
  const f = fold(r.title + " " + r.summary);
  const sr = seriesFor(r);
  const tags = new Set(sr?.s.tags ?? []);
  for (const [t, re] of TOPIC_RULES) if (re.test(f)) tags.add(t);
  if (!tags.size) tags.add("guncel-siyaset");
  const lang = isEnglish(r.title) ? "en" : undefined;
  // slug: URL'deki son parça (yazı kimliği ve baştaki numara atılarak), gerekiyorsa başlıktan
  let slug = r.url.replace(/\/$/, "").split("/").pop().replace(/-\d+$/, "").replace(/^\d+[ab]?-(?=[a-z])/, "");
  if (!slug || /^\d+$/.test(slug)) slug = slugify(r.title);
  if (slugs.has(slug)) slug = `${slug}-${r.pid}`;
  slugs.add(slug);
  const a = {
    id: `a-${r.pid}`,
    slug,
    title: r.title,
    summary: r.summary,
    publishedAt: date,
    ...(precision === "month" ? { datePrecision: "month" } : {}),
    source: "Serbestiyet",
    kind: "Köşe Yazısı",
    tags: [...tags].slice(0, 4),
    readingTime: 6,
    externalUrl: r.url,
    ...(lang ? { language: lang } : {}),
  };
  if (sr) {
    if (!seriesMembers.has(sr.s.id)) seriesMembers.set(sr.s.id, []);
    seriesMembers.get(sr.s.id).push({ a, label: sr.label });
  }
  out.push(a);
}

// Dizi bölüm sırası: Türkçe bölümler önce tarih sırasıyla, "EN"/"Ek" sonra.
// part = sıra numarası (gezgin için), label = kaynaktaki bölüm etiketi
const seriesOut = [];
for (const s of SERIES) {
  const mem = seriesMembers.get(s.id);
  if (!mem || mem.length < 2) { if (mem) console.warn("tek bölümlü dizi atlandı:", s.id); continue; }
  for (const m of mem) if (m.a.language === "en" && m.label && /^\d/.test(m.label)) m.label = "EN " + m.label;
  const rank = (l) => (l?.startsWith("EN ") ? 2 : l?.startsWith("Ek ") ? 1 : 0);
  const num = (l) => { const x = l?.match(/(\d+)([a-z]?)$/); return x ? +x[1] + (x[2] ? (x[2].charCodeAt(0) - 96) / 10 : 0) : NaN; };
  mem.sort((p, q) => {
    const r = rank(p.label) - rank(q.label);
    if (r) return r;
    const np = num(p.label), nq = num(q.label);
    if (!isNaN(np) && !isNaN(nq) && np !== nq) return np - nq;
    return p.a.publishedAt.localeCompare(q.a.publishedAt) || +p.a.id.slice(2) - +q.a.id.slice(2);
  });
  mem.forEach((m, i) => {
    const label = m.label ?? String(i + 1);
    m.a.series = { id: s.id, part: i + 1, ...(label !== String(i + 1) ? { label } : {}) };
  });
  seriesOut.push({ id: s.id, title: s.title, description: s.desc });
}

const header = `/* ------------------------------------------------------------------
   SERBESTİYET ARŞİVİ (otomatik üretildi: scripts/build-serbestiyet.mjs)
   Kaynak: serbestiyet.com yazar sayfası, ${rows.length} yazı (2014–2024).
   Başlık, tarih ve bağlantılar kaynaktaki gibidir. Özetler kısa editoryal
   notlardır; konu etiketleri anahtar kelimeyle atanmıştır, gözden geçirilmeli.
   Bu dosyayı elle düzenlemeyin; ham veriyi (data/raw) değiştirip yeniden üretin.
------------------------------------------------------------------- */
import type { Article, ArticleSeries } from "@/lib/types";
`;
const body =
  header +
  `\nexport const SERBESTIYET_SERIES: ArticleSeries[] = ${JSON.stringify(seriesOut, null, 1)};\n` +
  `\nexport const SERBESTIYET_ARCHIVE: Article[] = ${JSON.stringify(out)};\n`;
fs.writeFileSync(path.join(root, "data/serbestiyet-arsiv.ts"), body);

// Rapor
const tagCount = {};
out.forEach((a) => a.tags.forEach((t) => (tagCount[t] = (tagCount[t] || 0) + 1)));
console.log(`yazı: ${out.length}, dizi: ${seriesOut.length}, dizideki yazı: ${out.filter((a) => a.series).length}, İngilizce: ${out.filter((a) => a.language).length}, ay hassasiyetli: ${out.filter((a) => a.datePrecision).length}`);
console.log("etiketler:", Object.entries(tagCount).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}:${v}`).join(" "));
console.log("İngilizce:", out.filter((a) => a.language).map((a) => a.title).join(" | "));
for (const s of seriesOut) console.log(s.id, seriesMembers.get(s.id).map((m) => m.a.series.label ?? m.a.series.part).join(","));
