import { ArrowUpRight } from "lucide-react";
import type { RadarItem } from "@/lib/types";
import { formatDateShort, cx } from "@/lib/format";

/* "Bugünlerde masamda" — kürasyon akışı. Her kayıt: tür, eser, kaynak,
   Berktay'ın kısa notu ve dış bağlantı. */
export function RadarFeed({ items, variant = "column" }: { items: RadarItem[]; variant?: "column" | "page" }) {
  return (
    <ol className={cx(variant === "page" ? "divide-y divide-rule" : "")}>
      {items.map((r, i) => (
        <li
          key={r.id}
          id={r.id}
          className={cx(
            "group relative scroll-mt-24",
            variant === "column" ? "py-5 border-t border-rule first:border-t-0 first:pt-0" : "py-8 grid sm:grid-cols-12 gap-x-8",
          )}
        >
          <div className={cx("flex items-center gap-2", variant === "page" && "sm:col-span-3 sm:flex-col sm:items-start sm:gap-1.5")}>
            <span className="kicker text-accent">{r.category}</span>
            <span className="meta">{formatDateShort(r.date)}</span>
            {r.placeholder && (
              <span
                className="meta !text-[0.62rem] uppercase tracking-wider border border-dashed border-ink-mute/60 px-1.5 rounded"
                title="Bu not tasarım için yazılmış yer tutucudur; Halil Berktay'a ait değildir."
              >
                örnek not
              </span>
            )}
          </div>
          <div className={cx(variant === "page" && "sm:col-span-9")}>
            <a
              href={r.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cx("block mt-2 font-display leading-snug", variant === "page" ? "text-2xl sm:text-[1.75rem]" : "text-[1.18rem]")}
            >
              <span className="link-underline">{r.itemTitle}</span>
              <ArrowUpRight size={15} className="inline ml-1 -mt-1 text-ink-mute group-hover:text-accent transition-colors" />
            </a>
            <p className="meta mt-1">{r.author ? `${r.author} · ${r.itemSource}` : r.itemSource}</p>
            <blockquote
              className={cx(
                "mt-3 font-serif italic text-ink-soft leading-relaxed border-l border-accent/60 pl-3",
                variant === "page" ? "text-lg max-w-measure" : "text-[0.98rem]",
              )}
            >
              {r.berktayComment}
            </blockquote>
          </div>
          {variant === "column" && i === 0 && <span className="sr-only">En yeni kayıt</span>}
        </li>
      ))}
    </ol>
  );
}
