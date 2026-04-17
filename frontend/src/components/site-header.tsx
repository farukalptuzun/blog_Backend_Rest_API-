"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMe, logout } from "@/store/slices/auth-slice";

const nav = [
  { href: "/", label: "Ana sayfa" },
  { href: "/blog", label: "Blog" },
  { href: "/editor/new", label: "Yazı yaz" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

  useEffect(() => {
    setMounted(true);
    if (window.localStorage.getItem("accessToken")) {
      dispatch(fetchMe());
    }
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-10 border-b bg-white/70 backdrop-blur-xl dark:bg-black/50">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="group flex items-center gap-2 font-semibold tracking-tight">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border bg-white text-sm dark:bg-black">
            T
          </span>
          <span className="leading-none">
            Tarvina <span className="text-zinc-500 dark:text-zinc-400">Blog</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "rounded-full px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900",
                pathname === item.href && "bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border p-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menü"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
          {user ? (
            <button
              type="button"
              className="hidden rounded-full border px-3 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 md:inline-flex"
              onClick={() => dispatch(logout())}
            >
              Çıkış
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden rounded-full border px-3 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 md:inline-flex"
              >
                Giriş
              </Link>
              <Link
                href="/register"
                className="hidden rounded-full bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 md:inline-flex"
              >
                Kayıt ol
              </Link>
            </>
          )}

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border p-2 hover:bg-zinc-50 dark:hover:bg-zinc-900"
            onClick={() => setTheme((resolvedTheme || theme) === "dark" ? "light" : "dark")}
            aria-label="Tema değiştir"
          >
            {mounted && (resolvedTheme || theme) === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
      {mobileOpen ? (
        <div className="border-t bg-white/80 backdrop-blur-xl dark:bg-black/60 md:hidden">
          <div className="mx-auto max-w-6xl px-4 py-3">
            <div className="flex flex-col gap-1">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "rounded-xl px-3 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900",
                    pathname === item.href && "bg-zinc-50 dark:bg-zinc-900"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-2">
                {user ? (
                  <button
                    type="button"
                    className="rounded-xl border px-3 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900"
                    onClick={() => dispatch(logout())}
                  >
                    Çıkış
                  </button>
                ) : (
                  <>
                    <Link className="rounded-xl border px-3 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900" href="/login">
                      Giriş
                    </Link>
                    <Link className="rounded-xl bg-zinc-900 px-3 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900" href="/register">
                      Kayıt ol
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

