"use client";

import Link from "next/link";

export default function AdminIndexPage() {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold tracking-tight">Admin</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">Sol menüden bir bölüm seç.</p>
      <div className="flex flex-wrap gap-2">
        <Link className="rounded-full border px-4 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900" href="/admin/posts">
          Yazılar
        </Link>
        <Link className="rounded-full border px-4 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900" href="/admin/categories">
          Kategoriler
        </Link>
        <Link className="rounded-full border px-4 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900" href="/admin/users">
          Kullanıcılar
        </Link>
      </div>
    </div>
  );
}

