"use client";

import { useEffect } from "react";
import Link from "next/link";
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
        className="rounded-full border bg-white px-3 py-1.5 text-sm hover:bg-zinc-50 dark:bg-black dark:hover:bg-zinc-900"
      >
        Tümü
      </Link>
      {items.map((c) => (
        <Link
          key={c._id}
          href={`/blog/category/${c.slug}`}
          className="rounded-full border bg-white px-3 py-1.5 text-sm hover:bg-zinc-50 dark:bg-black dark:hover:bg-zinc-900"
        >
          {c.name}
        </Link>
      ))}
      {status === "loading" ? <span className="text-sm text-zinc-500">Yükleniyor…</span> : null}
    </div>
  );
}

