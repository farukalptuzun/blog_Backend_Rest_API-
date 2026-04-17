import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/slices/auth-slice";
import postsReducer from "@/store/slices/posts-slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

