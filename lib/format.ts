const MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const MONTHS_SHORT = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];

export type DatePrecision = "day" | "month" | "year";

export function formatDate(iso: string, precision: DatePrecision = "day") {
  const [y, m, d] = iso.split("-").map(Number);
  if (precision === "year") return String(y);
  if (precision === "month") return `${MONTHS[m - 1]} ${y}`;
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

export function formatDateShort(iso: string, precision: DatePrecision = "day") {
  const [y, m, d] = iso.split("-").map(Number);
  if (precision === "year") return String(y);
  if (precision === "month") return `${MONTHS_SHORT[m - 1]} ${y}`;
  return `${String(d).padStart(2, "0")} ${MONTHS_SHORT[m - 1]} ${y}`;
}

/** Türkçe duyarlı küçük harf + aksan katlama: arama karşılaştırmaları için */
export function fold(s: string) {
  return s
    .toLocaleLowerCase("tr")
    .replace(/[âà]/g, "a")
    .replace(/[îı]/g, "i")
    .replace(/[ûü]/g, "u")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/ş/g, "s")
    .replace(/ğ/g, "g");
}

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

/** On yıl etiketi, Türkçe ünlü uyumuyla: 1980'ler, 1990'lar, 2010'lar, 2000'ler.
    Ek, sayının okunuşundaki son sözcüğe göre seçilir (on, otuz, kırk, altmış, doksan → -lar). */
export function decadeLabel(decade: number, short = false) {
  const tens = Math.floor((decade % 100) / 10);
  const suffix = [1, 3, 4, 6, 9].includes(tens) ? "lar" : "ler";
  const text = short && decade % 100 !== 0 ? String(decade).slice(2) : String(decade);
  return `${text}’${suffix}`;
}
