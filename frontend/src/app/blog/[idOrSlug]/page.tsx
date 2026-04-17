"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api, getBackendOrigin } from "@/lib/api";
import { PostLikeButton } from "@/features/posts/post-like-button";
import { CalendarDays, Eye } from "lucide-react";

type Post = {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  coverImageUrl?: string;
  likeCount: number;
  likedByMe?: boolean;
  viewCount?: number;
  createdAt: string;
  author: { name: string };
  category?: { name: string; slug: string } | null;
};

export default function BlogDetailPage() {
  const params = useParams();
  const idOrSlug = typeof params.idOrSlug === "string" ? params.idOrSlug : params.idOrSlug?.[0] ?? "";
  const [post, setPost] = useState<Post | null>(null);
  const [similar, setSimilar] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!idOrSlug) return;
    let alive = true;
    setLoading(true);
    setError(null);
    setPost(null);

    api
      .get<{ post: Post }>(`/posts/${encodeURIComponent(idOrSlug)}`)
      .then((r) => {
        if (!alive) return;
        setPost(r.data.post);
      })
      .catch((err) => {
        if (!alive) return;
        const msg =
          err?.response?.data?.error?.message ||
          err?.message ||
          "Yazı yüklenemedi. Backend çalışıyor mu? (NEXT_PUBLIC_API_BASE_URL ile aynı adres olmalı.)";
        setError(String(msg));
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    api
      .get<{ items: Post[] }>(`/posts/${encodeURIComponent(idOrSlug)}/similar`, { params: { limit: 6 } })
      .then((r) => {
        if (!alive) return;
        setSimilar(r.data.items || []);
      })
      .catch(() => {});

    return () => {
      alive = false;
    };
  }, [idOrSlug]);

  if (loading) {
    return <div className="text-sm text-muted-foreground">Yükleniyor…</div>;
  }

  if (error || !post) {
    return (
      <div className="space-y-2 rounded-2xl border border-border bg-card p-6 text-sm">
        <p className="font-medium text-foreground">{error || "Yazı bulunamadı."}</p>
        <p className="text-muted-foreground">
          Frontend <code className="rounded bg-muted px-1">NEXT_PUBLIC_API_BASE_URL</code> değeri backend adresiyle
          eşleşmeli (örn. <code className="rounded bg-muted px-1">http://localhost:4000/api</code>). Backend varsayılan
          portu 4000&apos;dir; Next.js 3000&apos;de çalışır.
        </p>
        <Link href="/blog" className="inline-block text-primary underline underline-offset-4">
          Blog listesine dön
        </Link>
      </div>
    );
  }

  const origin = getBackendOrigin();

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        {post.coverImageUrl ? (
          <div
            className="overflow-hidden rounded-[28px] border border-border"
            style={{ background: "var(--image-tint)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImageUrl.startsWith("http") ? post.coverImageUrl : `${origin}${post.coverImageUrl}`}
              alt=""
              className="h-[220px] w-full object-cover md:h-[320px]"
            />
          </div>
        ) : null}

        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {post.category?.slug ? (
              <Link
                className="rounded-full border border-border bg-card/80 px-2 py-1 hover:bg-muted"
                href={`/blog/category/${post.category.slug}`}
              >
                {post.category.name}
              </Link>
            ) : null}
            <span className="font-medium text-foreground">{post.author?.name}</span>
          </div>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-foreground">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              {new Date(post.createdAt).toLocaleDateString("tr-TR")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Eye className="h-4 w-4" />
              {post.viewCount ?? 0}
            </span>
            <PostLikeButton
              postId={post._id}
              likeCount={post.likeCount}
              likedByMe={post.likedByMe}
              size="md"
              variant="meta"
              onUpdate={(next) => setPost((prev) => (prev ? { ...prev, ...next } : null))}
            />
          </div>
        </div>

        {post.tags?.length ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {post.tags.map((t) => (
              <Link
                key={t}
                href={`/blog/tag/${encodeURIComponent(t)}`}
                className="rounded-full bg-muted px-2.5 py-1 text-xs text-foreground hover:bg-muted/80"
              >
                #{t}
              </Link>
            ))}
          </div>
        ) : null}
      </header>

      <article className="post-content max-w-none">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Benzer yazılar</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {similar.map((p) => (
            <Link
              key={p._id}
              href={`/blog/${p._id}`}
              className="rounded-3xl border border-border bg-card p-4 shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"
            >
              <div className="line-clamp-2 font-medium text-foreground">{p.title}</div>
              <div className="mt-1 text-xs text-muted-foreground">{p.likeCount} beğeni</div>
            </Link>
          ))}
          {similar.length === 0 ? <div className="text-sm text-muted-foreground">Benzer yazı bulunamadı.</div> : null}
        </div>
      </section>
    </div>
  );
}
