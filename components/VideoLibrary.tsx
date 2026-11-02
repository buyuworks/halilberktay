"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import type { Video, VideoSeries } from "@/lib/types";
import { VideoPoster } from "@/components/VideoFrame";
import { CinemaModal } from "@/components/CinemaModal";
import { cx, formatDateShort } from "@/lib/format";

export function VideoLibrary({ videos, series }: { videos: Video[]; series: VideoSeries[] }) {
  const sp = useSearchParams();
  const router = useRouter();
  const [active, setActive] = useState<string>(sp.get("seri") ?? "tumu");
  const [medium, setMedium] = useState<"Tümü" | "Video" | "Ses Kaydı">("Tümü");
  const [open, setOpen] = useState<Video | null>(null);

  const choose = (id: string) => {
    setActive(id);
    router.replace(id === "tumu" ? "?" : `?seri=${id}`, { scroll: false });
  };

  const visibleSeries = series.filter((s) => active === "tumu" || s.id === active);

  return (
    <>
      <div className="sticky top-16 z-20 bg-paper/95 backdrop-blur border-b border-rule -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex items-center gap-6 overflow-x-auto scrollbar-none py-3">
          {[{ id: "tumu", title: "Tüm seriler" }, ...series].map((s) => (
            <button
              key={s.id}
              onClick={() => choose(s.id)}
              className={cx(
                "whitespace-nowrap text-sm pb-1 border-b-2 transition-colors",
                active === s.id ? "border-accent text-ink" : "border-transparent text-ink-mute hover:text-ink",
              )}
            >
              {s.title}
            </button>
          ))}
          <span className="ml-auto flex gap-1 shrink-0 pl-4">
            {(["Tümü", "Video", "Ses Kaydı"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMedium(m)}
                className={cx("kicker px-2 py-1 rounded-full", medium === m ? "bg-ink text-paper" : "text-ink-mute hover:text-ink")}
              >
                {m === "Ses Kaydı" ? "Ses" : m}
              </button>
            ))}
          </span>
        </div>
      </div>

      {visibleSeries.map((s) => {
        const list = videos
          .filter((v) => v.series === s.id && (medium === "Tümü" || v.medium === medium))
          .sort((a, b) => (a.part && b.part ? a.part - b.part : b.publishedAt.localeCompare(a.publishedAt)));
        if (!list.length && medium !== "Tümü") return null;
        return (
          <section key={s.id} className="mt-14" aria-labelledby={`seri-${s.id}`}>
            <div className="grid lg:grid-cols-12 gap-6 mb-6">
              <div className="lg:col-span-4">
                <p className="kicker text-accent">{s.platform}</p>
                <h2 id={`seri-${s.id}`} className="font-display text-3xl mt-1 leading-tight">
                  {s.title}
                </h2>
              </div>
              <p className="lg:col-span-6 font-serif text-ink-soft leading-relaxed self-end">{s.description}</p>
              <p className="lg:col-span-2 meta lg:text-right self-end">{list.length} kayıt</p>
            </div>
            {list.length === 0 ? (
              <div className="border border-dashed border-rule p-8 text-center">
                <p className="font-display text-xl">Bu dizinin bölümleri aktarılıyor.</p>
                <p className="meta mt-2">YouTube oynatma listesi bağlantısı eklendiğinde bölümler otomatik listelenecek.</p>
              </div>
            ) : (
              <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                {list.map((v) => (
                  <li key={v.id}>
                    <button className="group text-left w-full" onClick={() => setOpen(v)}>
                      <VideoPoster video={v} compact />
                      <p className="meta mt-3">
                        {v.part ? `${v.part}. bölüm · ` : ""}
                        {formatDateShort(v.publishedAt)}
                        {v.medium === "Ses Kaydı" ? " · ses" : ""}
                      </p>
                      <p className="font-display text-xl leading-snug mt-1 link-underline">{v.title}</p>
                      <p className="font-serif text-sm text-ink-soft mt-2 line-clamp-2 leading-relaxed">{v.summary}</p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
      <CinemaModal video={open} onClose={() => setOpen(null)} />
    </>
  );
}
