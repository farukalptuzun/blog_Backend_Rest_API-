import clsx from "clsx";
import type React from "react";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={clsx("rounded-2xl border border-border bg-card p-4", className)} />;
}
