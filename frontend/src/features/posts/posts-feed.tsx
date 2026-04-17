"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getBackendOrigin } from "@/lib/api";
import { fetchPosts, resetFeed } from "@/store/slices/posts-slice";
import { PostLikeButton } from "@/features/posts/post-like-button";
import { Sparkles } from "lucide-react";

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export type PostsFeedProps = {
  /** Etiket ile filtre (ör. /blog/tag/js) */
  tag?: string | null;
};

export function PostsFeed({ tag }: PostsFeedProps = {}) {
  const dispatch = useAppDispatch();
  const { items, page, limit, hasMore, status } = useAppSelector((s) => s.posts);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const nextPage = useMemo(() => (page || 1) + 1, [page]);

  const filterKey = useMemo(() => (tag ? `t:${tag}` : "all"), [tag]);

  useEffect(() => {
    dispatch(resetFeed());
    dispatch(
      fetchPosts({
        page: 1,
        limit,
        sort: "latest",
        ...(tag ? { tag } : {}),
      })
    );
  }, [dispatch, filterKey, limit, tag]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && status !== "loading") {
          dispatch(
            fetchPosts({
              page: nextPage,
              limit,
              sort: "latest",
              ...(tag ? { tag } : {}),
            })
          );
        }
      },
      { rootMargin: "400px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [dispatch, hasMore, limit, nextPage, status, tag]);

  return (
    <div className="space-y-4">
      {items.map((p, idx) => (
        <motion.div
          key={p._id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: Math.min(0.15, idx * 0.02) }}
          className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"
        >
          {/* Tüm karta tıklanınca yazıya git; alt katmandaki link */}
          <Link
            href={`/blog/${p._id}`}
            className="absolute inset-0 z-0"
            aria-label={p.title}
            tabIndex={-1}
          />
          {/* pointer-events-none: tıklama alttaki yazı linkine gider; etiket/beğeni için auto */}
          <div className="relative z-[1] grid gap-4 p-5 md:grid-cols-[160px_1fr] md:items-start pointer-events-none">
            <div className="relative h-40 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-muted to-card md:h-28">
              {p.coverImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.coverImageUrl.startsWith("http") ? p.coverImageUrl : `${getBackendOrigin()}${p.coverImageUrl}`}
                  alt=""
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-muted-foreground">
                  <Sparkles className="h-5 w-5" />
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{p.author?.name}</span>
                <span>•</span>
                <span>{new Date(p.createdAt).toLocaleDateString("tr-TR")}</span>
                <span>•</span>
                <span>{p.viewCount ?? 0} görüntülenme</span>
              </div>

              <h2 className="mt-2 text-lg font-semibold leading-snug tracking-tight">
                <span className="bg-gradient-to-b from-[var(--title-from)] to-[var(--title-to)] bg-clip-text text-transparent">
                  {p.title}
                </span>
              </h2>

              <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                {stripHtml(p.content).slice(0, 220)}
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                {Array.isArray(p.tags) && p.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {p.tags.slice(0, 4).map((t) => (
                      <Link
                        key={t}
                        href={`/blog/tag/${encodeURIComponent(t)}`}
                        className="pointer-events-auto rounded-full bg-muted px-2 py-1 text-xs text-foreground hover:bg-muted/80"
                        onClick={(e) => e.stopPropagation()}
                      >
                        #{t}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <span />
                )}

                <PostLikeButton
                  postId={p._id}
                  likeCount={p.likeCount}
                  likedByMe={p.likedByMe}
                  size="sm"
                  className="pointer-events-auto"
                />
              </div>
            </div>
          </div>
          {Array.isArray(p.tags) && p.tags.length > 0 ? (
            <div className="px-5 pb-5 md:hidden" />
          ) : null}
        </motion.div>
      ))}

      <div ref={sentinelRef} />
      {status === "loading" ? <div className="text-sm text-muted-foreground">Yükleniyor…</div> : null}
      {!hasMore && items.length > 0 ? <div className="text-sm text-muted-foreground">Hepsi bu kadar.</div> : null}
    </div>
  );
}
