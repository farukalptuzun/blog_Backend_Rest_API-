"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAppSelector } from "@/store/hooks";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

export type CommentNode = {
  _id: string;
  content: string;
  createdAt: string;
  author: { _id: string; name: string };
  likeCount?: number;
  replies: CommentNode[];
};

function CommentCard({
  comment,
  depth,
  onThreadChange,
}: {
  comment: CommentNode;
  depth: number;
  onThreadChange: () => Promise<void>;
}) {
  const user = useAppSelector((s) => s.auth.user);
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submitReply(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !replyText.trim()) return;
    setSubmitting(true);
    try {
      await api.post(`/comments/${comment._id}/replies`, { content: replyText.trim() });
      setReplyText("");
      setShowReply(false);
      await onThreadChange();
    } catch {
      /* toast yok */
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={clsx("space-y-3", depth > 0 && "ml-3 border-l border-border pl-4 md:ml-6 md:pl-5")}>
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-medium text-foreground">{comment.author?.name ?? "Kullanıcı"}</span>
          <time className="text-xs text-muted-foreground" dateTime={comment.createdAt}>
            {new Date(comment.createdAt).toLocaleString("tr-TR")}
          </time>
        </div>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground">{comment.content}</p>
        {user ? (
          <button
            type="button"
            className="mt-2 text-xs font-medium text-primary hover:underline"
            onClick={() => setShowReply((v) => !v)}
          >
            {showReply ? "Cevabı iptal et" : "Cevap ver"}
          </button>
        ) : null}
        {showReply && user ? (
          <form onSubmit={submitReply} className="mt-3 space-y-2">
            <textarea
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              rows={3}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Cevabını yaz…"
              maxLength={2000}
              disabled={submitting}
            />
            <Button type="submit" size="sm" disabled={submitting || !replyText.trim()}>
              {submitting ? "Gönderiliyor…" : "Cevabı gönder"}
            </Button>
          </form>
        ) : null}
      </div>
      {comment.replies?.length
        ? comment.replies.map((r) => (
            <CommentCard key={r._id} comment={r} depth={depth + 1} onThreadChange={onThreadChange} />
          ))
        : null}
    </div>
  );
}

export function PostComments({ postId }: { postId: string }) {
  const user = useAppSelector((s) => s.auth.user);
  const router = useRouter();
  const pathname = usePathname();
  const [items, setItems] = useState<CommentNode[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rootText, setRootText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    const { data } = await api.get<{ items: CommentNode[]; total: number }>(`/posts/${postId}/comments`);
    setItems(data.items ?? []);
    setTotal(data.total ?? 0);
  }, [postId]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    load()
      .catch(() => {})
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [load]);

  async function submitRoot(e: React.FormEvent) {
    e.preventDefault();
    if (!rootText.trim()) return;
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(pathname || "/")}`);
      return;
    }
    setSubmitting(true);
    try {
      await api.post(`/posts/${postId}/comments`, { content: rootText.trim() });
      setRootText("");
      await load();
    } catch {
      /* */
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="space-y-4 border-t border-border pt-8">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-foreground">Yorumlar</h2>
        {total > 0 ? (
          <span className="text-xs text-muted-foreground">
            {total} {total === 1 ? "yorum" : "yorum"}
          </span>
        ) : null}
      </div>

      {user ? (
        <form onSubmit={submitRoot} className="space-y-2 rounded-2xl border border-border bg-card p-4">
          <label className="text-sm font-medium text-foreground" htmlFor="comment-root">
            Yorum yaz
          </label>
          <textarea
            id="comment-root"
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            rows={4}
            value={rootText}
            onChange={(e) => setRootText(e.target.value)}
            placeholder="Düşüncelerini paylaş…"
            maxLength={2000}
            disabled={submitting}
          />
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">En fazla 2000 karakter</span>
            <Button type="submit" disabled={submitting || !rootText.trim()}>
              {submitting ? "Gönderiliyor…" : "Yorumu gönder"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          Yorum yapmak için{" "}
          <Link href={`/login?next=${encodeURIComponent(pathname || "/")}`} className="font-medium text-primary underline underline-offset-4">
            giriş yap
          </Link>
          .
        </div>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Yorumlar yükleniyor…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Henüz yorum yok. İlk yorumu sen yaz.</p>
      ) : (
        <div className="space-y-4">
          {items.map((c) => (
            <CommentCard key={c._id} comment={c} depth={0} onThreadChange={load} />
          ))}
        </div>
      )}
    </section>
  );
}
