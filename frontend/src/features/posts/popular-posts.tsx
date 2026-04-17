"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchPosts } from "@/store/slices/posts-slice";
import { TrendingUp } from "lucide-react";

export function PopularPosts() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.posts.items);

  useEffect(() => {
    dispatch(fetchPosts({ page: 1, limit: 6, sort: "popular" }));
  }, [dispatch]);

  return (
    <div className="space-y-2 rounded-3xl border bg-white p-4 shadow-sm shadow-zinc-950/5 dark:bg-black dark:shadow-zinc-950/40">
      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-200">
        <TrendingUp className="h-4 w-4" />
        En çok beğenilenler
      </div>
      {items.slice(0, 6).map((p) => (
        <Link
          key={p._id}
          href={`/blog/${p._id}`}
          className="block rounded-2xl px-3 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-950"
        >
          <div className="text-sm font-medium line-clamp-2">{p.title}</div>
          <div className="mt-1 text-xs text-zinc-500">{p.likeCount} beğeni</div>
        </Link>
      ))}
      {items.length === 0 ? <div className="text-sm text-zinc-500">Henüz yazı yok.</div> : null}
    </div>
  );
}

