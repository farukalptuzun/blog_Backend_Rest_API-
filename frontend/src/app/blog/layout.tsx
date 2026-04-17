import type { ReactNode } from "react";
import { BlogTagsSidebar } from "@/features/blog/blog-tags-sidebar";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
      <BlogTagsSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
