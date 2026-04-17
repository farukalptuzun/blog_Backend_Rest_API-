"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { CalendarDays, Eye, Heart } from "lucide-react";

type Post = {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  coverImageUrl?: string;
  likeCount: number;
  viewCount?: number;
  createdAt: string;
  author: { name: string };
  category?: { name: string; slug: string } | null;
};

export default function BlogDetailPage() {
  const { idOrSlug } = useParams<{ idOrSlug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [similar, setSimilar] = useState<Post[]>([]);

  useEffect(() => {
    let alive = true;
    api
      .get<{ post: Post }>(`/posts/${idOrSlug}`)
      .then((r) => {
        if (!alive) return;
        setPost(r.data.post);
      })
      .catch(() => {});

    api
      .get<{ items: Post[] }>(`/posts/${idOrSlug}/similar`, { params: { limit: 6 } })
      .then((r) => {
        if (!alive) return;
        setSimilar(r.data.items || []);
      })
      .catch(() => {});

    return () => {
      alive = false;
    };
  }, [idOrSlug]);

  if (!post) return <div className="text-sm text-zinc-500">Yükleniyor…</div>;

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        {post.coverImageUrl ? (
          <div className="overflow-hidden rounded-[28px] border bg-black/5 dark:bg-white/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImageUrl.startsWith("http") ? post.coverImageUrl : `http://localhost:3000${post.coverImageUrl}`}
              alt=""
              className="h-[220px] w-full object-cover md:h-[320px]"
            />
          </div>
        ) : null}

        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
            {post.category?.slug ? (
              <Link
                className="rounded-full border bg-white/60 px-2 py-1 hover:bg-white dark:bg-black/40 dark:hover:bg-black"
                href={`/blog/category/${post.category.slug}`}
              >
                {post.category.name}
              </Link>
            ) : null}
            <span className="font-medium text-zinc-700 dark:text-zinc-200">{post.author?.name}</span>
          </div>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              {new Date(post.createdAt).toLocaleDateString("tr-TR")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Eye className="h-4 w-4" />
              {post.viewCount ?? 0}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Heart className="h-4 w-4" />
              {post.likeCount}
            </span>
          </div>
        </div>

        {post.tags?.length ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {post.tags.map((t) => (
              <Link
                key={t}
                href={`/blog/tag/${encodeURIComponent(t)}`}
                className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                #{t}
              </Link>
            ))}
          </div>
        ) : null}
      </header>

      <article className="prose prose-zinc max-w-none dark:prose-invert">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Benzer yazılar</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {similar.map((p) => (
            <Link
              key={p._id}
              href={`/blog/${p._id}`}
              className="rounded-3xl border bg-white p-4 shadow-sm shadow-zinc-950/5 hover:-translate-y-0.5 hover:shadow-md hover:shadow-zinc-950/10 dark:bg-black dark:shadow-zinc-950/40"
            >
              <div className="font-medium line-clamp-2">{p.title}</div>
              <div className="mt-1 text-xs text-zinc-500">{p.likeCount} beğeni</div>
            </Link>
          ))}
          {similar.length === 0 ? <div className="text-sm text-zinc-500">Benzer yazı bulunamadı.</div> : null}
        </div>
      </section>
    </div>
  );
}

