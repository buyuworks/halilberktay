"use client";

import { useState } from "react";
import { ArrowUpRight, Headphones, Play } from "lucide-react";
import type { Video } from "@/lib/types";
import { VIDEO_SERIES } from "@/data/videos";
import { cx } from "@/lib/format";

/* ------------------------------------------------------------------
   VİDEO ÇERÇEVESİ
   - youtubeId varsa: "tıkla-yükle" cephesi (facade) → youtube-nocookie
     iframe. Sayfa açılışında YouTube betikleri yüklenmez (performans + KVKK).
   - youtubeId yoksa: seriye özgü tipografik afiş + kaynağa bağlantı.
------------------------------------------------------------------- */

export function VideoPoster({
  video,
  compact = false,
  thumb = false,
  hideTitle = false,
  className,
}: {
  video: Video;
  compact?: boolean;
  thumb?: boolean;
  hideTitle?: boolean;
  className?: string;
}) {
  const series = VIDEO_SERIES.find((s) => s.id === video.series);
  const audio = video.medium === "Ses Kaydı";
  if (video.youtubeId) {
    return (
      <div className={cx("relative aspect-video overflow-hidden bg-black", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-90"
          loading="lazy"
        />
        <PlayBadge audio={audio} />
      </div>
    );
  }
  if (thumb) {
    // Küçük liste görseli: yalnızca dizi monogramı / bölüm numarası
    const mono = video.part
      ? String(video.part).padStart(2, "0")
      : (series?.title ?? "")
          .split(/[\s·#]+/)
          .filter((w) => /^[A-ZÇĞİÖŞÜ]/.test(w))
          .slice(0, 2)
          .map((w) => w[0])
          .join("");
    return (
      <div className={cx("relative aspect-video overflow-hidden text-[#efe8da]", audio ? "bg-[#1f3550]" : "bg-[#24201a]", className)}>
        <span className="absolute left-3 top-2 font-display text-3xl opacity-80 leading-none">{mono}</span>
        <span className="absolute left-3 bottom-2 font-mono text-[0.55rem] opacity-55">{video.publishedAt.slice(0, 4)}</span>
        <span className="absolute right-2 bottom-2 h-7 w-7 rounded-full bg-[#efe8da] text-[#1b1a17] grid place-items-center">
          {audio ? <Headphones size={12} /> : <Play size={11} className="translate-x-px" fill="currentColor" />}
        </span>
      </div>
    );
  }
  return (
    <div
      className={cx(
        "relative aspect-video overflow-hidden text-[#efe8da]",
        audio ? "bg-[#1f3550]" : "bg-[#1d1a15]",
        className,
      )}
    >
      {/* ince ızgara dokusu */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className={cx("relative h-full flex flex-col", compact ? "p-3.5" : "p-6")}>
        <p className="uppercase tracking-[0.16em] font-semibold" style={{ fontSize: compact ? "0.55rem" : "0.65rem", opacity: 0.75 }}>
          {series?.title}
          {video.part ? ` · ${video.part}` : ""}
        </p>
        {hideTitle ? (
          <p className="font-display mt-auto leading-none text-[7rem] sm:text-[9rem] opacity-90 -mb-3">
            {video.part ? String(video.part).padStart(2, "0") : "▶"}
          </p>
        ) : (
          <p
            className={cx("font-display mt-auto leading-[1.05] max-w-[85%]", compact ? "text-lg" : "text-3xl sm:text-4xl")}
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            {video.title}
          </p>
        )}
        <p className="font-mono mt-2 opacity-60" style={{ fontSize: compact ? "0.55rem" : "0.7rem" }}>
          {series?.platform} · {video.publishedAt.slice(0, 4)}
        </p>
      </div>
      <PlayBadge audio={audio} />
    </div>
  );
}

function PlayBadge({ audio }: { audio: boolean }) {
  return (
    <span className="absolute right-3 bottom-3 h-10 w-10 rounded-full bg-[#efe8da] text-[#1b1a17] grid place-items-center shadow-lg transition-transform group-hover:scale-110">
      {audio ? <Headphones size={16} /> : <Play size={16} className="translate-x-px" fill="currentColor" />}
    </span>
  );
}

export function VideoPlayer({ video, autoplay = false }: { video: Video; autoplay?: boolean }) {
  const [loaded, setLoaded] = useState(autoplay);
  if (video.youtubeId) {
    return loaded ? (
      <div className="relative aspect-video bg-black">
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    ) : (
      <button className="group block w-full" onClick={() => setLoaded(true)} aria-label={`${video.title} — oynat`}>
        <VideoPoster video={video} />
      </button>
    );
  }
  return (
    <div className="relative">
      <VideoPoster video={video} />
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 flex flex-wrap items-center gap-3 bg-gradient-to-t from-black/70 to-transparent">
        <span className="meta !text-[#efe8da]/80">YouTube kimliği henüz eklenmedi</span>
        {video.sourceUrl && (
          <a
            href={video.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm bg-[#efe8da] text-[#1b1a17] px-3 py-1.5 rounded-full hover:bg-white"
          >
            Kaynakta {video.medium === "Ses Kaydı" ? "dinle" : "izle"} <ArrowUpRight size={14} />
          </a>
        )}
      </div>
    </div>
  );
}
