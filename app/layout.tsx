import { SITE_URL } from "@/lib/site";
import type { Metadata, Viewport } from "next";
import { Newsreader, Source_Serif_4, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CommandPalette } from "@/components/CommandPalette";

const newsreader = Newsreader({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-newsreader",
  display: "swap",
});
const sourceSerif = Source_Serif_4({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-source-serif",
  display: "swap",
});
const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter", display: "swap" });
const plexMono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { types: { "application/rss+xml": [{ url: "/rss.xml", title: "Halil Berktay · Yeni yazılar" }] } },
  title: { default: "Halil Berktay", template: "%s · Halil Berktay" },
  description:
    "Halil Berktay'ın kitapları, makaleleri, köşe yazıları ve konuşma kayıtları.",
  openGraph: { locale: "tr_TR", type: "website", siteName: "Halil Berktay" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f2ea" },
    { media: "(prefers-color-scheme: dark)", color: "#15130f" },
  ],
};

// İlk boyamadan önce tema sınıfını ayarlar (karanlık modda beyaz yanıp sönmeyi önler)
const themeScript = `(function(){try{var t=localStorage.getItem('hb-theme');var d=t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');var s=localStorage.getItem('hb-reader-scale');if(s)document.documentElement.style.setProperty('--reader-scale',s);}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="tr"
      suppressHydrationWarning
      className={`${newsreader.variable} ${sourceSerif.variable} ${inter.variable} ${plexMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh flex flex-col">
        <a href="#icerik" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] bg-ink text-paper px-3 py-2 text-sm">
          İçeriğe geç
        </a>
        <SiteHeader />
        <main id="icerik" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <CommandPalette />
      </body>
    </html>
  );
}
