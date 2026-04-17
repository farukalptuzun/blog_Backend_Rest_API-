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

  if (!user) return <div className="text-sm text-muted-foreground">Kontrol ediliyor…</div>;

  return (
    <div className="grid gap-6 lg:grid-cols-4">
      <aside className="rounded-2xl border border-border bg-card p-4">
        <div className="text-sm font-semibold text-foreground">Admin Panel</div>
        <div className="mt-3 space-y-1 text-sm">
          <Link className="block rounded-xl px-3 py-2 text-foreground hover:bg-muted" href="/admin/posts">
            Yazılar
          </Link>
          <Link className="block rounded-xl px-3 py-2 text-foreground hover:bg-muted" href="/admin/categories">
            Kategoriler
          </Link>
          <Link className="block rounded-xl px-3 py-2 text-foreground hover:bg-muted" href="/admin/users">
            Kullanıcılar
          </Link>
        </div>
      </aside>
      <section className="lg:col-span-3">{children}</section>
    </div>
  );
}
