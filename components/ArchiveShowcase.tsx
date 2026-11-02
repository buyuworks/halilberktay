"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import type { ArchiveEntry } from "@/lib/content";
import type { ContentType, TopicId, Video } from "@/lib/types";
import { TOPICS } from "@/data/topics";
import { VIDEOS } from "@/data/videos";
import { BOOKS } from "@/data/books";
import { VideoPoster } from "@/components/VideoFrame";
import { CinemaModal } from "@/components/CinemaModal";
import { BookCover } from "@/components/BookCover";
import { TypeLabel } from "@/components/EntryViews";
import { cx, formatDateShort } from "@/lib/format";
import { SHOWCASE_TOPICS, SHOWCASE_TYPES } from "@/lib/showcase";

const TYPES = SHOWCASE_TYPES;
const FEATURED_SERIES = "Ulusal Kurtuluş Savaşı mı, Milli Mücadele mi?";
const FEATURED_TOPICS = SHOWCASE_TOPICS;

/* Ana sayfadaki Birleşik Arşiv vitrini: tür × konu çapraz filtresi */
/** entries: vitrin için önceden seçilmiş alt küme; counts: tam arşivdeki sayılar ("Tür|konu") */
export function ArchiveShowcase({ entries, counts }: { entries: ArchiveEntry[]; counts?: Record<string, number> }) {
  const [type, setType] = useState<(typeof TYPES)[number]>("Tümü");
  const [topic, setTopic] = useState<TopicId | null>(null);
  const [video, setVideo] = useState<Video | null>(null);

  const pool = entries.filter((e) => e.type !== "Radar");
  const filtered = useMemo(
    () => pool.filter((e) => (type === "Tümü" || e.type === type) && (!topic || e.tags.includes(topic))),
    [pool, type, topic],
  );
  // "Tümü" görünümünde vitrin çeşitlendirilir: her tür/dizi grubundan sırayla bir kayıt
  const isMix = type === "Tümü" && !topic;
  const diversified = useMemo(() => {
    if (!isMix) return filtered;
    const groups = new Map<string, ArchiveEntry[]>();
    for (const e of filtered) {
      const k = e.type === "Makale" ? `${e.kind}|${e.seriesLabel ?? ""}` : e.type;
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k)!.push(e);
    }
    // Ana sayfada zaten öne çıkan dizi vitrinin sonuna alınır
    const lists = [...groups.values()].sort(
      (a, b) => Number(a[0].seriesLabel === FEATURED_SERIES) - Number(b[0].seriesLabel === FEATURED_SERIES),
    );
    const out: ArchiveEntry[] = [];
    let round = 0;
    while (out.length < filtered.length && round < 50) {
      for (const l of lists) if (l[round]) out.push(l[round]);
      round++;
    }
    return out;
  }, [filtered, isMix]);
  const shown = diversified.slice(0, isMix ? 8 : 9);
  const count = (t: (typeof TYPES)[number]) =>
    counts?.[`${t}|${topic ?? ""}`] ??
    pool.filter((e) => (t === "Tümü" || e.type === t) && (!topic || e.tags.includes(topic))).length;

  const params = new URLSearchParams();
  if (type !== "Tümü") params.set("tur", type);
  if (topic) params.set("konu", topic);

  return (
    <div>
      <div className="flex flex-col gap-5 pb-5 border-b border-rule">
        <div className="flex flex-wrap gap-x-5 gap-y-2" role="tablist" aria-label="İçerik türü">
          {TYPES.map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={type === t}
              onClick={() => setType(t)}
              className={cx(
                "font-display text-xl sm:text-2xl transition-colors pb-1 border-b-2",
                type === t ? "text-ink border-accent" : "text-ink-mute border-transparent hover:text-ink",
              )}
            >
              {t === "Tümü" ? "Tümü" : t === "Makale" ? "Yazılar" : t === "Kitap" ? "Kitaplar" : t === "Video" ? "Videolar" : "Ses"}
              <sup className="meta ml-1 align-super">{count(t)}</sup>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-1.5" aria-label="Konu filtresi">
          <span className="meta mr-2">Konuya göre:</span>
          {FEATURED_TOPICS.map((t) => (
            <button
              key={t}
              onClick={() => setTopic(topic === t ? null : t)}
              aria-pressed={topic === t}
              className={cx(
                "text-[0.78rem] px-2.5 py-1 border rounded-full transition-colors",
                topic === t ? "bg-ink text-paper border-ink" : "border-rule text-ink-soft hover:border-ink-mute",
              )}
            >
              {TOPICS[t].short ?? TOPICS[t].label}
            </button>
          ))}
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="py-16 text-center font-display text-2xl text-ink-mute">Bu kesişimde henüz kayıt yok.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 border-l border-rule -ml-px">
          {shown.map((e, i) => (
            <ShowcaseCell key={e.id} e={e} big={i === 0 && isMix} onVideo={setVideo} />
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <Link href={`/arsiv/${params.size ? `?${params}` : ""}`} className="group inline-flex items-center gap-2 text-accent">
          <span className="link-underline">{filtered.length} kaydın tümünü gelişmiş arşivde gör</span>
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <CinemaModal video={video} onClose={() => setVideo(null)} />
    </div>
  );
}

function ShowcaseCell({ e, big, onVideo }: { e: ArchiveEntry; big: boolean; onVideo: (v: Video) => void }) {
  const base = cx("group border-r border-b border-rule p-5 sm:p-6 flex flex-col min-h-[15rem]", big && "sm:col-span-2 lg:row-span-1");
  if (e.type === "Video" || e.type === "Ses Kaydı") {
    const v = VIDEOS.find((x) => x.id === e.id)!;
    return (
      <button className={cx(base, "text-left")} onClick={() => onVideo(v)} aria-label={`${e.title} — sinema modunda aç`}>
        <VideoPoster video={v} compact />
        <TypeLabel type={e.type} />
        <span className="mt-2 font-display text-xl leading-snug link-underline self-start">{e.title}</span>
        <span className="meta mt-auto pt-3">
          {e.seriesLabel} · {formatDateShort(e.date)}
        </span>
      </button>
    );
  }
  if (e.type === "Kitap") {
    const b = BOOKS.find((x) => x.id === e.id)!;
    return (
      <Link href={e.href} className={cx(base, "flex-row gap-5")}>
        <BookCover book={b} size="sm" className="w-24 shrink-0 transition-transform duration-500 group-hover:-translate-y-1" />
        <span className="flex flex-col min-w-0">
          <TypeLabel type="Kitap" kind={e.kind} />
          <span className="mt-2 font-display text-xl leading-snug">{b.title}</span>
          {b.subtitle && <span className="font-display italic text-ink-soft text-sm mt-1">{b.subtitle}</span>}
          <span className="meta mt-auto pt-3">
            {b.publisher} · {b.year}
          </span>
        </span>
      </Link>
    );
  }
  return (
    <Link href={e.href} className={base}>
      <div className="flex items-center gap-2">
        <TypeLabel type="Makale" kind={e.kind} />
        <span className="meta">· {e.source}</span>
      </div>
      {e.seriesLabel && (
        <p className="meta mt-3 !text-ink-soft">
          {e.seriesLabel} · {e.partLabel ?? e.part}
        </p>
      )}
      <h3 className={cx("mt-2 font-display leading-[1.12]", big ? "text-3xl sm:text-[2.4rem]" : "text-[1.4rem]")}>
        <span className="link-underline">{e.title}</span>
      </h3>
      {e.summary && (
        <p className={cx("mt-3 font-serif text-ink-soft leading-relaxed", big ? "text-lg line-clamp-4 max-w-2xl" : "line-clamp-3")}>
          {e.summary}
        </p>
      )}
      <p className="meta mt-auto pt-4">
        {formatDateShort(e.date, e.datePrecision)}
        {e.readingTime ? ` · ${e.readingTime} dk` : ""}
      </p>
    </Link>
  );
}
