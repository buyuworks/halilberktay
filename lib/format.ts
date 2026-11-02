const MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const MONTHS_SHORT = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];

export function formatDate(iso: string, precision: "day" | "year" = "day") {
  const [y, m, d] = iso.split("-").map(Number);
  if (precision === "year") return String(y);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

export function formatDateShort(iso: string, precision: "day" | "year" = "day") {
  const [y, m, d] = iso.split("-").map(Number);
  if (precision === "year") return String(y);
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
