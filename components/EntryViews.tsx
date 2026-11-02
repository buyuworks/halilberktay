import Link from "next/link";
import { ArrowUpRight, BookOpen, FileText, Headphones, CirclePlay, Radar } from "lucide-react";
import type { ArchiveEntry } from "@/lib/content";
import type { ContentType, TopicId } from "@/lib/types";
import { TOPICS } from "@/data/topics";
import { Highlight } from "@/components/Highlight";
import { cx, formatDateShort } from "@/lib/format";

const ICON: Record<ContentType, typeof FileText> = {
  Makale: FileText,
  Video: CirclePlay,
  "Ses Kaydı": Headphones,
  Kitap: BookOpen,
  Radar: Radar,
};

export function TypeLabel({ type, kind }: { type: ContentType; kind?: string }) {
  const Icon = ICON[type];
  return (
    <span className="kicker inline-flex items-center gap-1.5 text-accent">
      <Icon size={12} strokeWidth={2} />
      {kind && type === "Makale" ? kind : type}
    </span>
  );
}

export function TopicTag({ id, href = true, active = false }: { id: TopicId; href?: boolean; active?: boolean }) {
  const cls = cx(
    "inline-block text-[0.72rem] px-2 py-0.5 border rounded-full transition-colors",
    active ? "bg-ink text-paper border-ink" : "border-rule text-ink-soft hover:border-ink-mute hover:text-ink",
  );
  return href ? (
    <Link href={`/konular/${id}/`} className={cls}>
      {TOPICS[id].short ?? TOPICS[id].label}
    </Link>
  ) : (
    <span className={cls}>{TOPICS[id].short ?? TOPICS[id].label}</span>
  );
}

/** Arşiv listesi satırı — katalog fişi düzeni: sol künye sütunu + başlık/özet */
export function ArchiveRow({ e, query = "" }: { e: ArchiveEntry; query?: string }) {
  const internal = e.type !== "Radar";
  const Title = (
    <span className="font-display text-[1.35rem] sm:text-[1.5rem] leading-[1.15] link-underline">
      <span lang={e.lang}>
        <Highlight text={e.title} query={query} />
      </span>
    </span>
  );
  return (
    <article className="group grid grid-cols-12 gap-x-6 gap-y-2 py-6 border-b border-rule">
      <div className="col-span-12 sm:col-span-3 flex sm:flex-col gap-x-3 gap-y-1.5 items-baseline sm:items-start">
        <TypeLabel type={e.type} kind={e.kind} />
        <span className="meta">{formatDateShort(e.date, e.datePrecision)}</span>
        {e.lang === "en" && (
          <span className="meta border border-rule rounded-sm px-1 leading-tight" title="İngilizce metin">
            EN
          </span>
        )}
        {e.sample && (
          <span className="meta border border-dashed border-accent/60 text-accent rounded-sm px-1 leading-tight" title="Yorum metni tasarım için yazılmış örnektir">
            örnek not
          </span>
        )}
        <span className="meta hidden sm:block truncate max-w-full" title={e.source}>
          {e.source}
        </span>
      </div>
      <div className="col-span-12 sm:col-span-9">
        {e.seriesLabel && e.type === "Makale" && (
          <p className="meta mb-1.5 !text-ink-soft">
            Dizi: {e.seriesLabel}
            {e.part ? ` · ${e.partLabel ?? e.part}. bölüm` : ""}
          </p>
        )}
        {internal ? (
          <Link href={e.href} className="block">
            {Title}
          </Link>
        ) : (
          <a href={e.external} target="_blank" rel="noopener noreferrer" className="block">
            {Title} <ArrowUpRight size={16} className="inline text-ink-mute" />
          </a>
        )}
        {e.summary && (
          <p className="mt-2 font-serif text-ink-soft leading-relaxed line-clamp-2">
            <Highlight text={e.summary} query={query} />
          </p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {e.tags.slice(0, 4).map((t) => (
            <TopicTag key={t} id={t} />
          ))}
          {e.readingTime && <span className="meta ml-1">· {e.readingTime} dk okuma</span>}
          <span className="meta sm:hidden ml-1">· {e.source}</span>
        </div>
      </div>
    </article>
  );
}
