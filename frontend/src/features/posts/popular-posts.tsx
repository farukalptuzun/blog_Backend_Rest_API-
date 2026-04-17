"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchPosts } from "@/store/slices/posts-slice";
import { PostLikeButton } from "@/features/posts/post-like-button";
import { TrendingUp } from "lucide-react";

export function PopularPosts() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.posts.items);

  useEffect(() => {
    dispatch(fetchPosts({ page: 1, limit: 6, sort: "popular" }));
  }, [dispatch]);

  return (
    <div className="space-y-2 rounded-3xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
        <TrendingUp className="h-4 w-4" />
        En çok beğenilenler
      </div>
      {items.slice(0, 6).map((p) => (
        <div
          key={p._id}
          className="flex items-start justify-between gap-2 rounded-2xl px-3 py-2 hover:bg-muted"
        >
          <Link href={`/blog/${p._id}`} className="min-w-0 flex-1 self-center">
            <div className="line-clamp-2 text-sm font-medium">{p.title}</div>
          </Link>
          <PostLikeButton
            postId={p._id}
            likeCount={p.likeCount}
            likedByMe={p.likedByMe}
            size="sm"
            className="shrink-0 px-2 py-0.5"
          />
        </div>
      ))}
      {items.length === 0 ? <div className="text-sm text-muted-foreground">Henüz yazı yok.</div> : null}
    </div>
  );
}
