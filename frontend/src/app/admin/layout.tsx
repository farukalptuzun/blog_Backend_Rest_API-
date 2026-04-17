"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMe } from "@/store/slices/auth-slice";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  useEffect(() => {
    if (user && user.role !== "admin") router.replace("/");
  }, [router, user]);

  if (!user) return <div className="text-sm text-zinc-500">Kontrol ediliyor…</div>;

  return (
    <div className="grid gap-6 lg:grid-cols-4">
      <aside className="rounded-2xl border bg-white p-4 dark:bg-black">
        <div className="text-sm font-semibold">Admin Panel</div>
        <div className="mt-3 space-y-1 text-sm">
          <Link className="block rounded-xl px-3 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-950" href="/admin/posts">
            Yazılar
          </Link>
          <Link className="block rounded-xl px-3 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-950" href="/admin/categories">
            Kategoriler
          </Link>
          <Link className="block rounded-xl px-3 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-950" href="/admin/users">
            Kullanıcılar
          </Link>
        </div>
      </aside>
      <section className="lg:col-span-3">{children}</section>
    </div>
  );
}

