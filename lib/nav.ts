export const NAV = [
  { href: "/arsiv/", label: "Arşiv" },
  { href: "/yazilar/", label: "Yazılar" },
  { href: "/videolar/", label: "Video & Ses" },
  { href: "/kitaplar/", label: "Kitaplar" },
  { href: "/kenar-notlari/", label: "Kenar Notları" },
  { href: "/biyografi/", label: "Biyografi" },
];

export function openSearch(q?: string) {
  window.dispatchEvent(new CustomEvent("hb:open-search", { detail: q }));
}
