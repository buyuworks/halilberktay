import { cx } from "@/lib/format";

/* Öneri aşaması: tasarıma özel üretilecek görsellerin yeri.
   Taralı alan her zaman çizilir; src varsa görsel üstüne biner. */
export function ImageSlot({
  code,
  label,
  ratio,
  src,
  alt = "",
  className,
  dark = false,
}: {
  code: string;
  label: string;
  ratio: string;
  src?: string;
  alt?: string;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div
      role={src ? undefined : "img"}
      aria-label={src ? undefined : `Görsel alanı ${code}: ${label}`}
      className={cx(
        "relative overflow-hidden grid place-items-center",
        !src && "border border-dashed",
        dark ? "border-white/25 text-[#ebe5d8]/70 bg-white/[0.03]" : "border-ink-mute/40 text-ink-mute bg-paper-sunk/60",
        src && "bg-paper",
        className,
      )}
      style={{ aspectRatio: ratio.replace(":", "/") }}
    >
      <div className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: "repeating-linear-gradient(135deg, currentColor 0 1px, transparent 1px 11px)" }} />
      <div className="relative text-center px-4">
        <p className="font-mono text-[0.7rem] tracking-[0.14em] uppercase">Görsel {code} · {ratio}</p>
        <p className="font-display italic text-lg mt-1">{label}</p>
      </div>
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover bg-paper mix-blend-multiply dark:mix-blend-normal dark:invert dark:hue-rotate-180 dark:opacity-75"
        />
      )}
    </div>
  );
}
