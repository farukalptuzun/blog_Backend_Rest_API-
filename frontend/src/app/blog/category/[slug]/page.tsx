"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { PostsFeed } from "@/features/posts/posts-feed";
import { useAppDispatch } from "@/store/hooks";
import { fetchPosts, resetFeed } from "@/store/slices/posts-slice";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(resetFeed());
    dispatch(fetchPosts({ page: 1, limit: 10, sort: "latest", categorySlug: slug }));
  }, [dispatch, slug]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Kategori: {slug}</h1>
      <PostsFeed />
    </div>
  );
}

