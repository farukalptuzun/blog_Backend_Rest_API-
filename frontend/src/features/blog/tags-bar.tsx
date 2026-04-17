"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export function TagsBar() {
  const [items, setItems] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "loading">("loading");

  useEffect(() => {
    let alive = true;
    api
      .get<{ items: string[] }>("/posts/tags")
      .then((r) => {
        if (alive) setItems(r.data.items ?? []);
      })
      .catch(() => {
        if (alive) setItems([]);
      })
      .finally(() => {
        if (alive) setStatus("idle");
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="flex flex-wrap gap-2">
      <Link href="/blog" className="rounded-full border border-border bg-card px-3 py-1.5 text-sm hover:bg-muted">
        Tümü
      </Link>
      {items.map((t) => (
        <Link
          key={t}
          href={`/blog/tag/${encodeURIComponent(t)}`}
          className="rounded-full border border-border bg-card px-3 py-1.5 text-sm hover:bg-muted"
        >
          #{t}
        </Link>
      ))}
      {status === "loading" ? <span className="text-sm text-muted-foreground">Yükleniyor…</span> : null}
    </div>
  );
}
