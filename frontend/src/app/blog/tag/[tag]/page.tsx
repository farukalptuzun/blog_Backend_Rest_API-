"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { PostsFeed } from "@/features/posts/posts-feed";
import { useAppDispatch } from "@/store/hooks";
import { fetchPosts, resetFeed } from "@/store/slices/posts-slice";

export default function TagPage() {
  const { tag } = useParams<{ tag: string }>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(resetFeed());
    dispatch(fetchPosts({ page: 1, limit: 10, sort: "latest", tag: decodeURIComponent(tag) }));
  }, [dispatch, tag]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">#{decodeURIComponent(tag)}</h1>
      <PostsFeed />
    </div>
  );
}

