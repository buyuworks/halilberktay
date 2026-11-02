import type { Book } from "@/lib/types";
import { cx } from "@/lib/format";

/* ------------------------------------------------------------------
   TİPOGRAFİK KAPAK
   Gerçek kapak taranana kadar, her kitap için yayınevi/dönem karakterine
   göre üretilen zarif bir kapak. coverImage dolduğunda görsel kullanılır.
------------------------------------------------------------------- */

const PALETTES = [
  { bg: "#8b261d", fg: "#f6efe3", line: "#f6efe3" }, // kiremit
  { bg: "#1f3550", fg: "#efe9dc", line: "#c9a96a" }, // lacivert + altın
  { bg: "#ece4d3", fg: "#1b1a17", line: "#8b261d" }, // krem
  { bg: "#2b2a26", fg: "#e9e1cf", line: "#c9a96a" }, // mürekkep
  { bg: "#4b5840", fg: "#f2ecdf", line: "#f2ecdf" }, // zeytin
  { bg: "#c8b48f", fg: "#1b1a17", line: "#1b1a17" }, // kraft
];

function hash(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

export function BookCover({ book, size = "md", className }: { book: Book; size?: "sm" | "md" | "lg"; className?: string }) {
  if (book.coverImage) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={book.coverImage} alt={`${book.title} kapağı`} className={cx("aspect-[2/3] object-cover", className)} />;
  }
  const h = hash(book.id);
  const p = PALETTES[h % PALETTES.length];
  const variant = h % 3;
  const long = book.title.length > 34;
  const titleSize =
    size === "lg"
      ? long ? "text-[1.55rem]" : "text-[1.9rem]"
      : size === "sm"
        ? long ? "text-[0.78rem]" : "text-[0.95rem]"
        : long ? "text-[1.02rem]" : "text-[1.25rem]";
  // Çerçeveli varyantta metin çerçevenin içinde kalsın
  const pad =
    variant === 1
      ? size === "lg" ? "p-10" : size === "sm" ? "p-4" : "p-6"
      : size === "lg" ? "p-7" : size === "sm" ? "p-3" : "p-4";

  return (
    <div
      className={cx(
        "relative aspect-[2/3] overflow-hidden select-none shadow-[0_1px_0_rgba(0,0,0,0.06),0_18px_30px_-18px_rgba(0,0,0,0.45)]",
        className,
      )}
      style={{ background: p.bg, color: p.fg }}
      aria-label={`${book.title} — tipografik kapak`}
      role="img"
    >
      {/* sırt gölgesi */}
      <div className="absolute inset-y-0 left-0 w-[6%] bg-gradient-to-r from-black/25 to-transparent" />
      <div className={cx("relative h-full flex flex-col", pad)}>
        {variant === 0 && <div className="h-px w-full mb-3" style={{ background: p.line }} />}
        {variant === 1 && (
          <div className="absolute inset-[7%] border pointer-events-none" style={{ borderColor: `${p.line}66` }} />
        )}
        <p
          className="uppercase tracking-[0.18em] font-sans font-semibold"
          style={{ fontSize: size === "lg" ? "0.7rem" : "0.5rem", opacity: 0.85 }}
        >
          Halil Berktay
        </p>
        <div className={cx("mt-auto", variant === 2 && "mt-[38%]")}>
          <p className={cx("font-display leading-[1.05] font-medium hyphens-auto", titleSize)} lang="tr" style={{ textWrap: "balance" } as React.CSSProperties}>
            {book.title}
          </p>
          {book.subtitle && size !== "sm" && (
            <p className="font-display italic mt-2 leading-snug opacity-80" style={{ fontSize: size === "lg" ? "1rem" : "0.72rem" }}>
              {book.subtitle}
            </p>
          )}
        </div>
        <div className="mt-auto pt-3 flex items-end justify-between gap-2">
          <span className="font-sans opacity-90 leading-tight" style={{ fontSize: size === "lg" ? "0.7rem" : "0.5rem" }}>
            {book.publisher.split(",")[0]}
          </span>
          <span className="font-mono opacity-90" style={{ fontSize: size === "lg" ? "0.75rem" : "0.55rem" }}>
            {book.year}
          </span>
        </div>
      </div>
    </div>
  );
}
