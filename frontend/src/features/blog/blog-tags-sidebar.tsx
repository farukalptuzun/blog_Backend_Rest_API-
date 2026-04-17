"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { api } from "@/lib/api";
import { Hash, LayoutGrid } from "lucide-react";

export function BlogTagsSidebar() {
  const pathname = usePathname();
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

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
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const isAll = pathname === "/blog";

  return (
    <aside className="shrink-0 lg:w-56">
      <nav
        className="rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-card)] lg:sticky lg:top-20"
        aria-label="Blog etiketleri"
      >
        <div className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Etiketler</div>

        <ul className="space-y-0.5">
          <li>
            <Link
              href="/blog"
              className={clsx(
                "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition",
                isAll ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
            >
              <LayoutGrid className="h-4 w-4 shrink-0 opacity-80" />
              Tümü
            </Link>
          </li>
          {loading ? (
            <li className="px-3 py-2 text-sm text-muted-foreground">Yükleniyor…</li>
          ) : items.length === 0 ? (
            <li className="px-3 py-2 text-sm text-muted-foreground">Henüz etiket yok.</li>
          ) : (
            items.map((tag) => {
              const href = `/blog/tag/${encodeURIComponent(tag)}`;
              const active = pathname === href;
              return (
                <li key={tag}>
                  <Link
                    href={href}
                    className={clsx(
                      "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition",
                      active ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                    )}
                  >
                    <Hash className="h-4 w-4 shrink-0 opacity-80" />
                    <span className="truncate">{tag}</span>
                  </Link>
                </li>
              );
            })
          )}
        </ul>
      </nav>
    </aside>
  );
}
