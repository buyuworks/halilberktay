"use client";

import Link from "next/link";
import { useState } from "react";
import { LayoutGrid, Rows3 } from "lucide-react";
import type { Book } from "@/lib/types";
import { BookCover } from "@/components/BookCover";
import { cx } from "@/lib/format";

const ROLES = ["Tümü", "Yazar", "Ortak Yazar", "Editör", "Çevirmen", "Dizi Editörü"] as const;

export function BookShelf({ books }: { books: Book[] }) {
  const [role, setRole] = useState<(typeof ROLES)[number]>("Tümü");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const list = books
    .filter((b) => role === "Tümü" || b.role === role)
    .sort((a, b) => (order === "asc" ? a.year - b.year : b.year - a.year));

  return (
    <>
      <div className="mt-12 rule-double pt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {ROLES.map((r) => {
            const n = books.filter((b) => r === "Tümü" || b.role === r).length;
            if (!n) return null;
            return (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={cx("text-sm pb-0.5 border-b", role === r ? "border-accent text-ink" : "border-transparent text-ink-mute hover:text-ink")}
              >
                {r} <span className="meta">{n}</span>
              </button>
            );
          })}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => setOrder(order === "asc" ? "desc" : "asc")} className="meta border border-rule rounded px-2 py-1 hover:border-ink-mute">
            {order === "asc" ? "Eskiden yeniye" : "Yeniden eskiye"}
          </button>
          <button onClick={() => setView("grid")} aria-pressed={view === "grid"} aria-label="Raf görünümü" className={cx("p-1.5", view === "grid" ? "text-ink" : "text-ink-mute")}>
            <LayoutGrid size={17} />
          </button>
          <button onClick={() => setView("list")} aria-pressed={view === "list"} aria-label="Künye listesi" className={cx("p-1.5", view === "list" ? "text-ink" : "text-ink-mute")}>
            <Rows3 size={17} />
          </button>
        </div>
      </div>

      {view === "grid" ? (
        <ul className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 sm:gap-x-8 gap-y-14">
          {list.map((b) => (
            <li key={b.id}>
              <Link href={`/kitaplar/${b.slug}/`} className="group block">
                <BookCover book={b} className="transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-2 group-hover:rotate-[-0.6deg]" />
                <p className="mt-4 font-display text-lg leading-snug">{b.title}</p>
                {b.subtitle && <p className="font-display italic text-sm text-ink-soft leading-snug mt-0.5">{b.subtitle}</p>}
                <p className="meta mt-1.5">
                  {b.year} · {b.role}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <ol className="mt-6 border-t border-rule">
          {list.map((b) => (
            <li key={b.id} className="border-b border-rule">
              <Link href={`/kitaplar/${b.slug}/`} className="group grid grid-cols-[4rem_1fr] sm:grid-cols-[4rem_1fr_12rem] gap-4 py-4 items-baseline">
                <span className="font-mono text-accent">{b.year}</span>
                <span>
                  <span className="font-display text-xl link-underline">{b.title}</span>
                  {b.subtitle && <span className="font-display italic text-ink-soft">: {b.subtitle}</span>}
                  <span className="block font-serif text-sm text-ink-mute mt-0.5">
                    {b.publisher}
                    {b.contributors ? ` · ${b.contributors}` : ""}
                  </span>
                </span>
                <span className="hidden sm:block kicker text-ink-mute text-right">{b.role}</span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}
