"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMe, logout } from "@/store/slices/auth-slice";
import { useThemeTransition } from "@/components/theme-transition";
import type React from "react";

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
  const { themeToggleRef, runTransition, isTransitioning } = useThemeTransition();

  useEffect(() => {
    setMounted(true);
    if (window.localStorage.getItem("accessToken")) {
      dispatch(fetchMe());
    }
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  function toggleTheme(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    const current = resolvedTheme || theme;
    runTransition(current === "dark" ? "light" : "dark");
  }

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="group flex items-center gap-2 font-semibold tracking-tight">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-border bg-card text-sm text-foreground">
            T
          </span>
          <span className="leading-none">
            Tarvina <span className="text-muted-foreground">Blog</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "rounded-full px-3 py-1.5 text-sm text-foreground hover:bg-muted",
                pathname === item.href && "bg-muted font-medium"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-border p-2 hover:bg-muted md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menü"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
          {user ? (
            <button
              type="button"
              className="hidden rounded-full border border-border px-3 py-1.5 text-sm hover:bg-muted md:inline-flex"
              onClick={() => dispatch(logout())}
            >
              Çıkış
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden rounded-full border border-border px-3 py-1.5 text-sm hover:bg-muted md:inline-flex"
              >
                Giriş
              </Link>
              <Link
                href="/register"
                className="hidden rounded-full bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 md:inline-flex"
              >
                Kayıt ol
              </Link>
            </>
          )}

          <button
            ref={themeToggleRef}
            type="button"
            className={clsx(
              "inline-flex items-center justify-center rounded-full border border-border p-2 transition-opacity hover:bg-muted",
              isTransitioning && "opacity-0"
            )}
            onClick={toggleTheme}
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
        <div className="border-t border-border bg-background/90 backdrop-blur-xl md:hidden">
          <div className="mx-auto max-w-6xl px-4 py-3">
            <div className="flex flex-col gap-1">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "rounded-xl px-3 py-2 text-sm hover:bg-muted",
                    pathname === item.href && "bg-muted font-medium"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-2">
                {user ? (
                  <button
                    type="button"
                    className="rounded-xl border border-border px-3 py-2 text-sm hover:bg-muted"
                    onClick={() => dispatch(logout())}
                  >
                    Çıkış
                  </button>
                ) : (
                  <>
                    <Link className="rounded-xl border border-border px-3 py-2 text-sm hover:bg-muted" href="/login">
                      Giriş
                    </Link>
                    <Link
                      className="rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                      href="/register"
                    >
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
