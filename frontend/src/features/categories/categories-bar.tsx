"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCategories } from "@/store/slices/categories-slice";

export function CategoriesBar() {
  const dispatch = useAppDispatch();
  const { items, status } = useAppSelector((s) => s.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/blog"
        className="rounded-full border border-border bg-card px-3 py-1.5 text-sm hover:bg-muted"
      >
        Tümü
      </Link>
      {items.map((c) => (
        <Link
          key={c._id}
          href={`/blog/category/${c.slug}`}
          className="rounded-full border border-border bg-card px-3 py-1.5 text-sm hover:bg-muted"
        >
          {c.name}
        </Link>
      ))}
      {status === "loading" ? <span className="text-sm text-muted-foreground">Yükleniyor…</span> : null}
    </div>
  );
}
