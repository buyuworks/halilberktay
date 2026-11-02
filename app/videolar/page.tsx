import type { Metadata } from "next";
import { Suspense } from "react";
import { VIDEOS, VIDEO_SERIES } from "@/data/videos";
import { VideoLibrary } from "@/components/VideoLibrary";

export const metadata: Metadata = {
  title: "Video ve Ses",
  description: "Serbestiyet TV dizileri, TV programları, konferanslar ve podcast kayıtları.",
};

export default function VideosPage() {
  return (
    <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-10 pt-10 sm:pt-14">
      <header className="max-w-3xl mb-10">
        <p className="kicker text-accent">Video &amp; ses kütüphanesi</p>
        <h1 className="font-display text-display tracking-[-0.02em] mt-3">Video ve ses kayıtları</h1>
        <p className="mt-5 font-serif text-xl text-ink-soft leading-relaxed">
          Anlatım dizileri, tartışma programları, konferanslar ve podcast kayıtları.
        </p>
      </header>
      <Suspense>
        <VideoLibrary videos={VIDEOS} series={VIDEO_SERIES} />
      </Suspense>
    </div>
  );
}
