import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "@/lib/api";

export type User = {
  _id: string;
  email: string;
  username?: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
  role: "user" | "admin";
};

type AuthState = {
  user: User | null;
  status: "idle" | "loading" | "error";
};

const initialState: AuthState = {
  user: null,
  status: "idle",
};

export const fetchMe = createAsyncThunk("auth/me", async () => {
  const { data } = await api.get<{ user: User }>("/auth/me");
  return data.user;
});

export const login = createAsyncThunk(
  "auth/login",
  async (payload: { email?: string; username?: string; password: string }) => {
    const body =
      payload.username != null && String(payload.username).trim() !== ""
        ? { username: String(payload.username).trim(), password: payload.password }
        : { email: payload.email ?? "", password: payload.password };
    const { data } = await api.post<{ user: User; accessToken: string }>("/auth/login", body);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("accessToken", data.accessToken);
    }
    return data.user;
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (payload: { email: string; password: string; name: string }) => {
    const { data } = await api.post<{ user: User; accessToken: string }>("/auth/register", payload);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("accessToken", data.accessToken);
    }
    return data.user;
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("accessToken");
  }
  return true;
});

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchMe.pending, (s) => {
        s.status = "loading";
      })
      .addCase(fetchMe.fulfilled, (s, a) => {
        s.user = a.payload;
        s.status = "idle";
      })
      .addCase(fetchMe.rejected, (s) => {
        s.status = "error";
      })
      .addCase(login.fulfilled, (s, a) => {
        s.user = a.payload;
        s.status = "idle";
      })
      .addCase(register.fulfilled, (s, a) => {
        s.user = a.payload;
        s.status = "idle";
      })
      .addCase(logout.fulfilled, (s) => {
        s.user = null;
        s.status = "idle";
      });
  },
});

export default slice.reducer;

