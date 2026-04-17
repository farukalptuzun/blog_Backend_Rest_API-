"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchPosts } from "@/store/slices/posts-slice";
import { Heart, Sparkles } from "lucide-react";

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function PostsFeed() {
  const dispatch = useAppDispatch();
  const { items, page, limit, hasMore, status } = useAppSelector((s) => s.posts);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const nextPage = useMemo(() => (page || 1) + 1, [page]);

  useEffect(() => {
    dispatch(fetchPosts({ page: 1, limit, sort: "latest" }));
  }, [dispatch, limit]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && status !== "loading") {
          dispatch(fetchPosts({ page: nextPage, limit, sort: "latest" }));
        }
      },
      { rootMargin: "400px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [dispatch, hasMore, limit, nextPage, status]);

  return (
    <div className="space-y-4">
      {items.map((p, idx) => (
        <motion.div
          key={p._id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: Math.min(0.15, idx * 0.02) }}
          className="group overflow-hidden rounded-3xl border bg-white shadow-sm shadow-zinc-950/5 transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-zinc-950/10 dark:bg-black dark:shadow-zinc-950/40"
        >
          <div className="grid gap-4 p-5 md:grid-cols-[160px_1fr] md:items-start">
            <div className="relative h-40 overflow-hidden rounded-2xl border bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-950 dark:to-black md:h-28">
              {p.coverImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.coverImageUrl.startsWith("http") ? p.coverImageUrl : `http://localhost:3000${p.coverImageUrl}`}
                  alt=""
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-zinc-400">
                  <Sparkles className="h-5 w-5" />
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                <span className="font-medium text-zinc-700 dark:text-zinc-200">{p.author?.name}</span>
                <span>•</span>
                <span>{new Date(p.createdAt).toLocaleDateString("tr-TR")}</span>
                <span>•</span>
                <span>{p.viewCount ?? 0} görüntülenme</span>
                {p.category?.slug ? (
                  <>
                    <span>•</span>
                    <Link
                      className="rounded-full border bg-white/60 px-2 py-0.5 hover:bg-white dark:bg-black/40 dark:hover:bg-black"
                      href={`/blog/category/${p.category.slug}`}
                    >
                      {p.category.name}
                    </Link>
                  </>
                ) : null}
              </div>

              <Link href={`/blog/${p._id}`} className="mt-2 block text-lg font-semibold leading-snug tracking-tight">
                <span className="bg-gradient-to-b from-zinc-900 to-zinc-700 bg-clip-text text-transparent dark:from-zinc-50 dark:to-zinc-300">
                  {p.title}
                </span>
              </Link>

              <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {stripHtml(p.content).slice(0, 220)}
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                {Array.isArray(p.tags) && p.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {p.tags.slice(0, 4).map((t) => (
                      <Link
                        key={t}
                        href={`/blog/tag/${encodeURIComponent(t)}`}
                        className="rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                      >
                        #{t}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <span />
                )}

                <div className="inline-flex items-center gap-1 rounded-full border bg-white/60 px-3 py-1 text-xs text-zinc-700 dark:bg-black/40 dark:text-zinc-200">
                  <Heart className="h-3.5 w-3.5" />
                  {p.likeCount}
                </div>
              </div>
            </div>
          </div>
          {Array.isArray(p.tags) && p.tags.length > 0 ? (
            <div className="px-5 pb-5 md:hidden" />
          ) : null}
        </motion.div>
      ))}

      <div ref={sentinelRef} />
      {status === "loading" ? <div className="text-sm text-zinc-500">Yükleniyor…</div> : null}
      {!hasMore && items.length > 0 ? <div className="text-sm text-zinc-500">Hepsi bu kadar.</div> : null}
    </div>
  );
}

