import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { VIDEOS, VIDEO_SERIES } from "@/data/videos";
import { ARTICLES } from "@/data/articles";
import { VideoPlayer, VideoPoster } from "@/components/VideoFrame";
import { TopicTag } from "@/components/EntryViews";
import { formatDate, formatDateShort } from "@/lib/format";

export function generateStaticParams() {
  return VIDEOS.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const v = VIDEOS.find((x) => x.slug === slug);
  return v ? { title: v.title, description: v.summary } : {};
}

export default async function VideoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const v = VIDEOS.find((x) => x.slug === slug);
  if (!v) notFound();
  const series = VIDEO_SERIES.find((s) => s.id === v.series)!;
  const siblings = VIDEOS.filter((x) => x.series === v.series && x.id !== v.id);
  const related = ARTICLES.filter((a) => a.tags.some((t) => v.tags.includes(t)))
    .sort((x, y) => y.tags.filter((t) => v.tags.includes(t)).length - x.tags.filter((t) => v.tags.includes(t)).length)
    .slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": v.medium === "Ses Kaydı" ? "AudioObject" : "VideoObject",
    name: v.title,
    description: v.summary,
    uploadDate: v.publishedAt,
    embedUrl: v.youtubeId ? `https://www.youtube-nocookie.com/embed/${v.youtubeId}` : undefined,
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="bg-[#0d0c0a] text-[#efe8da]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
          <Link href="/videolar/" className="font-mono text-xs opacity-60 hover:opacity-100 inline-flex items-center gap-1">
            <ArrowLeft size={12} /> Video &amp; ses kütüphanesi
          </Link>
          <div className="mt-6">
            <VideoPlayer video={v} />
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 mt-10 grid md:grid-cols-12 gap-10">
        <div className="md:col-span-8">
          <p className="kicker text-accent">
            {series.title}
            {v.part ? ` · ${v.part}. bölüm` : ""}
          </p>
          <h1 className="font-display text-[2.4rem] sm:text-[3.2rem] leading-[1.05] mt-3 tracking-[-0.015em]">{v.title}</h1>
          <p className="mt-6 font-serif text-xl leading-relaxed text-ink-soft">{v.summary}</p>
          <div className="mt-6 flex flex-wrap gap-1.5">
            {v.tags.map((t) => (
              <TopicTag key={t} id={t} />
            ))}
          </div>
          {related.length > 0 && (
            <section className="mt-14">
              <p className="kicker text-ink-mute">Aynı konuda yazılar</p>
              <ul className="mt-3 border-t border-rule">
                {related.map((a) => (
                  <li key={a.id} className="border-b border-rule">
                    <Link href={`/yazilar/${a.slug}/`} className="group flex justify-between gap-6 py-3">
                      <span className="font-display text-lg link-underline">{a.title}</span>
                      <span className="meta shrink-0">{formatDateShort(a.publishedAt, a.datePrecision)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
        <aside className="md:col-span-4 md:border-l md:border-rule md:pl-8">
          <dl className="space-y-4">
            <div>
              <dt className="kicker text-ink-mute">Yayın</dt>
              <dd className="mt-1">{formatDate(v.publishedAt)}</dd>
            </div>
            <div>
              <dt className="kicker text-ink-mute">Platform</dt>
              <dd className="mt-1">{series.platform}</dd>
            </div>
            <div>
              <dt className="kicker text-ink-mute">Tür</dt>
              <dd className="mt-1">{v.medium}</dd>
            </div>
            {v.duration && (
              <div>
                <dt className="kicker text-ink-mute">Süre</dt>
                <dd className="mt-1">{v.duration}</dd>
              </div>
            )}
          </dl>
          {siblings.length > 0 && (
            <div className="mt-10">
              <p className="kicker text-ink-mute mb-4">Dizinin diğer kayıtları</p>
              <ul className="space-y-5">
                {siblings.map((s) => (
                  <li key={s.id}>
                    <Link href={`/videolar/${s.slug}/`} className="group block">
                      <VideoPoster video={s} compact />
                      <p className="font-display mt-2 leading-snug link-underline">{s.title}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
