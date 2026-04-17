import Link from "next/link";
import { PostsFeed } from "@/features/posts/posts-feed";
import { PopularPosts } from "@/features/posts/popular-posts";
import { TagsBar } from "@/features/blog/tags-bar";
import { Button } from "@/components/ui/button";
import { ArrowRight, PenLine } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[28px] border border-border bg-card p-6 shadow-[var(--shadow-card)]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-500/25 to-fuchsia-500/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 blur-3xl" />

        <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs text-foreground">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Canlı
            </div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground">
              Okunabilir, hızlı ve modern bir blog deneyimi.
            </h1>
            <p className="mt-2 text-muted-foreground">
              Son yazılar, popüler içerikler, etiket filtreleri ve zengin editör.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link href="/editor/new">
                <Button className="gap-2">
                  <PenLine className="h-4 w-4" />
                  Yazı oluştur
                </Button>
              </Link>
              <Link href="/blog">
                <Button variant="secondary" className="gap-2">
                  Tüm yazılar
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="w-full md:w-[360px]">
            <div className="rounded-3xl border border-border bg-card/80 p-4 text-sm text-foreground shadow-[var(--shadow-card)]">
              <div className="font-medium">Hızlı başlangıç</div>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-muted-foreground">
                <li>Giriş/Kayıt ol</li>
                <li>Yazılarına etiket ver</li>
                <li>Yeni yazı oluştur</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="relative mt-5">
          <TagsBar />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-3 text-lg font-semibold text-foreground">Son yazılar</h2>
          <PostsFeed />
        </div>
        <aside>
          <h2 className="mb-3 text-lg font-semibold text-foreground">Popüler</h2>
          <PopularPosts />
        </aside>
      </section>
    </div>
  );
}
