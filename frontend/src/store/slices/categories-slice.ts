import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "@/lib/api";

export type Category = { _id: string; name: string; slug: string };

type CategoriesState = {
  items: Category[];
  status: "idle" | "loading" | "error";
};

const initialState: CategoriesState = {
  items: [],
  status: "idle",
};

export const fetchCategories = createAsyncThunk("categories/list", async () => {
  const { data } = await api.get<{ items: Category[] }>("/categories");
  return data.items;
});

const slice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchCategories.pending, (s) => {
        s.status = "loading";
      })
      .addCase(fetchCategories.fulfilled, (s, a) => {
        s.items = a.payload;
        s.status = "idle";
      })
      .addCase(fetchCategories.rejected, (s) => {
        s.status = "error";
      });
  },
});

export default slice.reducer;

