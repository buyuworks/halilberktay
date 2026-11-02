import Link from "next/link";
import type { Article } from "@/lib/types";
import { formatDateShort } from "@/lib/format";
import { seriesTitle } from "@/lib/content";

/** Köşe yazısı listesi: tarih sütunu + başlık + dizi künyesi (sunucu bileşeni) */
export function ColumnList({ items, showYear = false }: { items: Article[]; showYear?: boolean }) {
  return (
    <ul className="border-t border-rule">
      {items.map((a) => (
        <li key={a.id} className="border-b border-rule">
          <Link href={`/yazilar/${a.slug}/`} className="group grid grid-cols-[5.5rem_1fr] gap-4 py-3.5">
            <span className="meta pt-1">
              {a.datePrecision === "month"
                ? formatDateShort(a.publishedAt, "month").slice(0, showYear ? 8 : 3)
                : formatDateShort(a.publishedAt).slice(0, showYear ? 11 : 6)}
            </span>
            <span>
              <span lang={a.language} className="font-display text-[1.15rem] leading-snug link-underline">
                {a.title}
              </span>
              <span className="meta block mt-0.5">
                {a.source}
                {a.language === "en" ? " · EN" : ""}
                {a.series ? ` · ${seriesTitle(a.series.id)}, ${a.series.label ?? a.series.part}` : ""}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Yıllara göre yazı yoğunluğu: her yıl bir çubuk, yıl sayfasına bağlanır */
export function YearIndex({ counts, current }: { counts: [string, number][]; current?: string }) {
  const max = Math.max(...counts.map(([, n]) => n));
  return (
    <nav aria-label="Yıllara göre yazılar" className="max-w-full overflow-x-auto scrollbar-none">
      <ol
        className="grid gap-px bg-rule border border-rule min-w-max sm:min-w-0"
        style={{ gridTemplateColumns: `repeat(${counts.length}, minmax(3.4rem, 1fr))` }}
      >
        {counts.map(([y, n]) => (
          <li key={y}>
            <Link
              href={`/yazilar/yil/${y}/`}
              aria-current={y === current ? "page" : undefined}
              className={`group flex flex-col justify-end h-28 px-1.5 py-2 bg-paper hover:bg-paper-raised ${y === current ? "!bg-paper-sunk" : ""}`}
            >
              <span className="flex-1 flex items-end" aria-hidden>
                <span
                  className={`block w-full ${y === current ? "bg-accent" : "bg-ink/15 group-hover:bg-accent/60"} transition-colors`}
                  style={{ height: `${Math.max(6, (n / max) * 100)}%` }}
                />
              </span>
              <span className="font-mono text-[0.8rem] mt-2 tabular-nums">{y}</span>
              <span className="meta !text-[0.62rem] tabular-nums">{n}</span>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
