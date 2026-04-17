import { PostsFeed } from "@/features/posts/posts-feed";

export default function BlogListPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">Blog</h1>
      <PostsFeed />
    </div>
  );
}

