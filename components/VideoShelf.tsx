"use client";

import { useState } from "react";
import type { Video, VideoSeries } from "@/lib/types";
import { VideoPoster } from "@/components/VideoFrame";
import { CinemaModal } from "@/components/CinemaModal";
import { formatDateShort } from "@/lib/format";

export function VideoShelf({ videos, series }: { videos: Video[]; series: VideoSeries[] }) {
  const [open, setOpen] = useState<Video | null>(null);
  const sorted = [...videos].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const featured = sorted.find((v) => v.series === "solun-kultur-seruveni" && v.part === 1) ?? sorted[0];
  const rest = sorted.filter((v) => v.id !== featured.id).slice(0, 5);
  const sTitle = (id: string) => series.find((s) => s.id === id)?.title;

  return (
    <>
      <div className="grid lg:grid-cols-12 gap-10">
        <button className="group lg:col-span-7 text-left" onClick={() => setOpen(featured)}>
          <VideoPoster video={featured} hideTitle className="ring-1 ring-white/10" />
          <p className="kicker mt-5 text-[#e0846f]">
            {sTitle(featured.series)} · {featured.part}. bölüm
          </p>
          <p className="font-display text-3xl sm:text-4xl mt-2 leading-tight group-hover:underline underline-offset-[6px] decoration-1">
            {featured.title}
          </p>
          <p className="font-serif text-lg mt-3 opacity-75 leading-relaxed max-w-2xl">{featured.summary}</p>
        </button>
        <ul className="lg:col-span-5 divide-y divide-white/10 border-y border-white/10 dark:divide-rule dark:border-rule">
          {rest.map((v) => (
            <li key={v.id}>
              <button className="group w-full flex gap-4 py-4 text-left" onClick={() => setOpen(v)}>
                <VideoPoster video={v} thumb className="w-28 sm:w-32 shrink-0" />
                <span className="min-w-0">
                  <span className="kicker block opacity-60">
                    {v.medium === "Ses Kaydı" ? "Ses · " : ""}
                    {sTitle(v.series)}
                  </span>
                  <span className="block font-display text-lg leading-snug mt-1 group-hover:underline underline-offset-4 decoration-1">
                    {v.title}
                  </span>
                  <span className="block font-mono text-[0.7rem] opacity-55 mt-1">{formatDateShort(v.publishedAt)}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <CinemaModal video={open} onClose={() => setOpen(null)} />
    </>
  );
}
