"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

/** globals.css ile aynı sayfa arka planları */
const PAGE_BG = { light: "#fafafa", dark: "#07070a" } as const;

type Target = "light" | "dark";

type ThemeTransitionContextValue = {
  themeToggleRef: RefObject<HTMLButtonElement | null>;
  runTransition: (to: Target) => void;
  isTransitioning: boolean;
};

const ThemeTransitionContext = createContext<ThemeTransitionContextValue | null>(null);

export function useThemeTransition() {
  const ctx = useContext(ThemeTransitionContext);
  if (!ctx) {
    throw new Error("useThemeTransition yalnızca ThemeTransitionProvider içinde kullanılmalıdır.");
  }
  return ctx;
}

const EASE = [0.22, 1, 0.36, 1] as const;
const DURATION = 0.78;
const CLEANUP_MS = Math.round(DURATION * 1000) + 120;

export function ThemeTransitionProvider({ children }: { children: React.ReactNode }) {
  const { setTheme } = useTheme();
  const themeToggleRef = useRef<HTMLButtonElement>(null);

  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);
  const [target, setTarget] = useState<Target | null>(null);
  const [fromRect, setFromRect] = useState<DOMRect | null>(null);
  const cleanupRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animatingRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (cleanupRef.current) clearTimeout(cleanupRef.current);
    };
  }, []);

  const runTransition = useCallback(
    (to: Target) => {
      if (animatingRef.current) return;
      if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setTheme(to);
        return;
      }
      const el = themeToggleRef.current;
      if (!el) {
        setTheme(to);
        return;
      }
      const rect = el.getBoundingClientRect();
      animatingRef.current = true;
      setFromRect(rect);
      setTarget(to);
      setActive(true);
      setTheme(to);

      if (cleanupRef.current) clearTimeout(cleanupRef.current);
      cleanupRef.current = setTimeout(() => {
        setActive(false);
        setTarget(null);
        setFromRect(null);
        animatingRef.current = false;
        cleanupRef.current = null;
      }, CLEANUP_MS);
    },
    [setTheme]
  );

  const value: ThemeTransitionContextValue = {
    themeToggleRef,
    runTransition,
    isTransitioning: active,
  };

  const showPortal = mounted && active && fromRect && target;

  return (
    <ThemeTransitionContext.Provider value={value}>
      {children}
      {showPortal ? <ThemeTransitionPortal fromRect={fromRect} target={target} /> : null}
    </ThemeTransitionContext.Provider>
  );
}

function ThemeTransitionPortal({ fromRect, target }: { fromRect: DOMRect; target: Target }) {
  const [size, setSize] = useState(() => ({
    w: typeof window !== "undefined" ? window.innerWidth : 0,
    h: typeof window !== "undefined" ? window.innerHeight : 0,
  }));

  useEffect(() => {
    const ro = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    ro();
    window.addEventListener("resize", ro);
    return () => window.removeEventListener("resize", ro);
  }, []);

  if (typeof document === "undefined") return null;

  const cx = size.w / 2;
  const cy = size.h / 2;

  const node = (
    <motion.div
      className="pointer-events-auto fixed inset-0 z-[9998]"
      initial={{ opacity: 1 }}
      aria-hidden
    >
      <motion.div
        className="will-change-transform fixed left-0 top-0 z-10 h-full w-1/2 shadow-2xl"
        style={{ backgroundColor: PAGE_BG[target] }}
        initial={{ x: 0 }}
        animate={{ x: "-100%" }}
        transition={{ duration: DURATION, ease: EASE, delay: 0.06 }}
      />
      <motion.div
        className="will-change-transform fixed right-0 top-0 z-10 h-full w-1/2 shadow-2xl"
        style={{ backgroundColor: PAGE_BG[target] }}
        initial={{ x: 0 }}
        animate={{ x: "100%" }}
        transition={{ duration: DURATION, ease: EASE, delay: 0.06 }}
      />

      <motion.div
        className="fixed z-20 flex items-center justify-center overflow-hidden rounded-2xl border-2 border-border bg-card shadow-2xl will-change-transform"
        style={{
          left: fromRect.left,
          top: fromRect.top,
          width: fromRect.width,
          height: fromRect.height,
        }}
        initial={{ x: 0, y: 0, scale: 1 }}
        animate={{
          x: cx - fromRect.left - fromRect.width / 2,
          y: cy - fromRect.top - fromRect.height / 2,
          scale: target === "light" ? 5 : 4.2,
        }}
        transition={{ duration: DURATION, ease: EASE }}
      >
        {target === "light" ? (
          <Sun
            className="text-amber-500 drop-shadow-[0_0_22px_rgba(251,191,36,0.55)]"
            strokeWidth={1.75}
            style={{
              width: "min(52%, 3rem)",
              height: "min(52%, 3rem)",
            }}
          />
        ) : (
          <Moon
            className="text-primary drop-shadow-[0_0_18px_rgba(250,250,250,0.35)]"
            strokeWidth={1.75}
            style={{
              width: "min(52%, 3rem)",
              height: "min(52%, 3rem)",
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );

  return createPortal(node, document.body);
}
