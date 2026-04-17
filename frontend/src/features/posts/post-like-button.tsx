"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { togglePostLike } from "@/store/slices/posts-slice";

type Props = {
  postId: string;
  likeCount: number;
  likedByMe?: boolean;
  /** Blog detay gibi listede olmayan sayfalar için yerel güncelleme */
  onUpdate?: (next: { likeCount: number; likedByMe: boolean }) => void;
  className?: string;
  size?: "sm" | "md";
  /** meta: tarih/görüntülenme satırı; pill: kart içi rozet */
  variant?: "pill" | "meta";
};

export function PostLikeButton({
  postId,
  likeCount,
  likedByMe = false,
  onUpdate,
  className,
  size = "md",
  variant = "pill",
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const [loading, setLoading] = useState(false);
  const [local, setLocal] = useState({ likeCount, likedByMe });

  useEffect(() => {
    setLocal({ likeCount, likedByMe });
  }, [likeCount, likedByMe]);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      const next = encodeURIComponent(pathname || "/");
      router.push(`/login?next=${next}`);
      return;
    }
    if (loading) return;
    setLoading(true);
    try {
      const result = await dispatch(
        togglePostLike({ postId, liked: local.likedByMe })
      ).unwrap();
      const next = { likeCount: result.likeCount, likedByMe: result.liked };
      setLocal(next);
      onUpdate?.(next);
    } catch {
      /* 401 vb. */
    } finally {
      setLoading(false);
    }
  }

  const iconClass = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      title={user ? (local.likedByMe ? "Beğeniyi kaldır" : "Beğen") : "Beğenmek için giriş yapın"}
      className={clsx(
        "inline-flex items-center gap-1.5 transition-colors disabled:opacity-60",
        variant === "pill" &&
          "rounded-full border border-border bg-card/80 px-3 py-1 text-xs text-foreground hover:bg-muted",
        variant === "meta" &&
          "rounded-lg border-0 bg-transparent px-2 py-1 text-sm text-muted-foreground hover:bg-muted/60",
        local.likedByMe &&
          variant === "pill" &&
          "border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400",
        local.likedByMe && variant === "meta" && "text-rose-600 dark:text-rose-400",
        !user && "cursor-pointer",
        className
      )}
    >
      <Heart className={clsx(iconClass, local.likedByMe && "fill-current")} />
      <span>{local.likeCount}</span>
    </button>
  );
}
