"use client";

import { useParams } from "next/navigation";
import { PostsFeed } from "@/features/posts/posts-feed";

export default function TagPage() {
  const params = useParams<{ tag: string }>();
  const raw = typeof params.tag === "string" ? params.tag : params.tag?.[0] ?? "";
  const tag = decodeURIComponent(raw);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">#{tag}</h1>
      <PostsFeed tag={tag} />
    </div>
  );
}

