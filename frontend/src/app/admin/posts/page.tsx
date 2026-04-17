"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

type Post = {
  _id: string;
  title: string;
  likeCount: number;
  viewCount?: number;
  createdAt: string;
};

export default function AdminPostsPage() {
  const [items, setItems] = useState<Post[]>([]);
  const [status, setStatus] = useState("");

  async function refresh() {
    const { data } = await api.get<{ items: Post[] }>("/posts", { params: { page: 1, limit: 50, sort: "latest" } });
    setItems(data.items || []);
  }

  useEffect(() => {
    refresh().catch((e) => setStatus(e?.response?.data?.error?.message || "Hata"));
  }, []);

  async function remove(id: string) {
    setStatus("Siliniyor…");
    try {
      await api.delete(`/posts/${id}`);
      await refresh();
      setStatus("Tamam");
    } catch (e: any) {
      setStatus(e?.response?.data?.error?.message || "Hata");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Yazılar</h1>
        <Link
          href="/editor/new"
          className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Yeni yazı
        </Link>
      </div>
      {status ? <div className="text-sm text-zinc-500">{status}</div> : null}
      <div className="space-y-2">
        {items.map((p) => (
          <div key={p._id} className="rounded-2xl border bg-white p-4 dark:bg-black">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="font-medium line-clamp-1">{p.title}</div>
                <div className="mt-1 text-xs text-zinc-500">
                  {new Date(p.createdAt).toLocaleDateString("tr-TR")} • {p.viewCount ?? 0} görüntülenme • {p.likeCount} beğeni
                </div>
              </div>
              <div className="flex gap-2">
                <Link className="rounded-full border px-3 py-1 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900" href={`/editor/${p._id}/edit`}>
                  Düzenle
                </Link>
                <button
                  className="rounded-full border px-3 py-1 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900"
                  onClick={() => remove(p._id)}
                  type="button"
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 ? <div className="text-sm text-zinc-500">Yazı yok.</div> : null}
      </div>
    </div>
  );
}

