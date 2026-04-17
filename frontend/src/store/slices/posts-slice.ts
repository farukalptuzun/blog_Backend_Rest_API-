import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "@/lib/api";

export type Category = { _id: string; name: string; slug: string };
export type Author = { _id: string; email: string; name: string; avatarUrl?: string };

export type Post = {
  _id: string;
  title: string;
  slug: string;
  content: string;
  tags: string[];
  coverImageUrl?: string;
  likeCount: number;
  viewCount?: number;
  createdAt: string;
  author: Author;
  category?: Category | null;
};

type PostsState = {
  items: Post[];
  total: number;
  page: number;
  limit: number;
  status: "idle" | "loading" | "error";
  hasMore: boolean;
};

const initialState: PostsState = {
  items: [],
  total: 0,
  page: 1,
  limit: 10,
  status: "idle",
  hasMore: true,
};

export const fetchPosts = createAsyncThunk(
  "posts/list",
  async (params: { page: number; limit: number; sort?: "latest" | "popular"; q?: string; tag?: string; categorySlug?: string }) => {
    const { data } = await api.get<{ items: Post[]; total: number; page: number; limit: number }>("/posts", {
      params,
    });
    return data;
  }
);

export const fetchPost = createAsyncThunk("posts/get", async (idOrSlug: string) => {
  const { data } = await api.get<{ post: Post }>(`/posts/${idOrSlug}`);
  return data.post;
});

export const fetchSimilar = createAsyncThunk("posts/similar", async (idOrSlug: string) => {
  const { data } = await api.get<{ items: Post[] }>(`/posts/${idOrSlug}/similar`, { params: { limit: 6 } });
  return data.items;
});

const slice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    resetFeed(s) {
      s.items = [];
      s.total = 0;
      s.page = 1;
      s.hasMore = true;
      s.status = "idle";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (s) => {
        s.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (s, a) => {
        s.status = "idle";
        const incoming = a.payload.items ?? [];
        const page = a.payload.page ?? 1;
        s.page = page;
        s.limit = a.payload.limit ?? s.limit;
        s.total = a.payload.total ?? s.total;
        if (page === 1) s.items = incoming;
        else s.items = [...s.items, ...incoming];
        s.hasMore = s.items.length < s.total;
      })
      .addCase(fetchPosts.rejected, (s) => {
        s.status = "error";
      });
  },
});

export const { resetFeed } = slice.actions;
export default slice.reducer;

