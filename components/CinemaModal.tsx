"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import type { Video } from "@/lib/types";
import { VideoPlayer } from "@/components/VideoFrame";
import { VIDEO_SERIES } from "@/data/videos";
import { TopicTag } from "@/components/EntryViews";
import { formatDate } from "@/lib/format";

/* Sinema modu: sayfanın üstünde karartılmış sahnede oynatıcı */
export function CinemaModal({ video, onClose }: { video: Video | null; onClose: () => void }) {
  useEffect(() => {
    if (!video) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", k);
      document.body.style.overflow = "";
    };
  }, [video, onClose]);

  if (!video) return null;
  const series = VIDEO_SERIES.find((s) => s.id === video.series);
  return (
    <div className="fixed inset-0 z-[70] bg-[#0d0c0a]/95 text-[#efe8da] overflow-y-auto animate-fade-up" role="dialog" aria-modal="true" aria-label={video.title}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-10">
        <div className="flex items-center justify-between mb-5">
          <p className="kicker opacity-70">
            Sinema modu · {series?.title}
            {video.part ? ` · ${video.part}. bölüm` : ""}
          </p>
          <button onClick={onClose} className="h-10 w-10 grid place-items-center rounded-full hover:bg-white/10" aria-label="Kapat (Esc)">
            <X size={22} />
          </button>
        </div>
        <VideoPlayer video={video} autoplay />
        <div className="mt-8 grid md:grid-cols-12 gap-6">
          <div className="md:col-span-8">
            <h2 className="font-display text-3xl sm:text-4xl leading-tight">{video.title}</h2>
            <p className="mt-4 font-serif text-lg leading-relaxed opacity-80">{video.summary}</p>
          </div>
          <div className="md:col-span-4 md:border-l md:border-white/15 md:pl-6 space-y-3">
            <p className="font-mono text-xs opacity-60">{formatDate(video.publishedAt)}</p>
            <p className="font-mono text-xs opacity-60">{series?.platform}{video.duration ? ` · ${video.duration}` : ""}</p>
            <div className="flex flex-wrap gap-1.5 [&_a]:!border-white/25 [&_a]:!text-[#efe8da]/80">
              {video.tags.map((t) => (
                <TopicTag key={t} id={t} />
              ))}
            </div>
            <Link href={`/videolar/${video.slug}/`} className="inline-block text-sm underline underline-offset-4 opacity-80 hover:opacity-100">
              Kayıt sayfasına git →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
