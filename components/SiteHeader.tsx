"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cx } from "@/lib/format";
import { NAV, openSearch } from "@/lib/nav";
import { loadArchiveIndex } from "@/lib/useArchiveIndex";


export function SiteHeader() {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [isMac, setIsMac] = useState(true);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform));
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => setMenu(false), [path]);

  return (
    <header
      className={cx(
        "sticky top-0 z-40 bg-paper/90 backdrop-blur supports-[backdrop-filter]:bg-paper/80 transition-[border-color,box-shadow] duration-300",
        scrolled ? "border-b border-rule" : "border-b border-transparent",
      )}
    >
      <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-10 h-16 flex items-center gap-6">
        <Link href="/" className="group flex items-baseline gap-3 shrink-0" aria-label="Halil Berktay — ana sayfa">
          <span className="font-display text-[1.6rem] leading-none tracking-[-0.01em] font-medium">
            Halil Berktay
          </span>
        </Link>

        <nav aria-label="Ana menü" className="hidden lg:flex items-center gap-6 ml-auto">
          {NAV.map((n) => {
            const active = path?.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cx(
                  "text-[0.9rem] tracking-[0.01em] py-1 border-b transition-colors",
                  active ? "border-accent text-ink" : "border-transparent text-ink-soft hover:text-ink",
                )}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto lg:ml-2 flex items-center gap-1.5">
          <button
            onClick={() => openSearch()}
            onPointerEnter={() => void loadArchiveIndex().catch(() => {})}
            onFocus={() => void loadArchiveIndex().catch(() => {})}
            className="group flex items-center gap-2 h-9 pl-3 pr-2 border border-rule hover:border-ink-mute rounded-full text-ink-soft hover:text-ink transition-colors"
            aria-label="Arşivde ara"
          >
            <Search size={15} strokeWidth={1.75} />
            <span className="hidden sm:inline text-sm">Ara</span>
            <kbd className="hidden sm:inline meta border border-rule rounded px-1.5 py-px text-[0.65rem]">
              {isMac ? "⌘" : "Ctrl"} K
            </kbd>
          </button>
          <ThemeToggle />
          <button
            className="lg:hidden h-9 w-9 grid place-items-center text-ink-soft hover:text-ink"
            onClick={() => setMenu((m) => !m)}
            aria-expanded={menu}
            aria-label="Menü"
          >
            {menu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menu && (
        <nav className="lg:hidden border-t border-rule bg-paper animate-fade-up" aria-label="Mobil menü">
          <ul className="mx-auto max-w-page px-4 sm:px-6 py-3">
            {NAV.map((n) => (
              <li key={n.href} className="border-b border-rule last:border-0">
                <Link href={n.href} className="block py-3 font-display text-2xl">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
