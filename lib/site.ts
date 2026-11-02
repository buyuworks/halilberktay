/** Yayın adresi. Alan adı belli olunca NEXT_PUBLIC_SITE_URL ile değiştirin (yer tutucu). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://halilberktay.example").replace(/\/$/, "");

/** Arama motorlarına açık mı? Demo aşamasında kapalı; yayına alırken NEXT_PUBLIC_INDEX=1 verin. */
export const INDEXABLE = process.env.NEXT_PUBLIC_INDEX === "1";
