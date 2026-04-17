"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Category = { _id: string; name: string; slug: string };

export default function AdminCategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");

  async function refresh() {
    const { data } = await api.get<{ items: Category[] }>("/categories");
    setItems(data.items || []);
  }

  useEffect(() => {
    refresh().catch(() => {});
  }, []);

  async function create() {
    setStatus("Oluşturuluyor…");
    try {
      await api.post("/categories", { name });
      setName("");
      await refresh();
      setStatus("Tamam");
    } catch (e: any) {
      setStatus(e?.response?.data?.error?.message || "Hata");
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Kategoriler</h1>
      <div className="rounded-2xl border bg-white p-4 dark:bg-black space-y-3">
        <div className="flex flex-col gap-2 md:flex-row">
          <input
            className="flex-1 rounded-xl border px-3 py-2 bg-transparent"
            placeholder="Kategori adı"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            type="button"
            onClick={create}
            className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Ekle
          </button>
        </div>
        {status ? <div className="text-sm text-zinc-500">{status}</div> : null}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {items.map((c) => (
          <div key={c._id} className="rounded-2xl border bg-white p-4 dark:bg-black">
            <div className="font-medium">{c.name}</div>
            <div className="text-xs text-zinc-500">{c.slug}</div>
          </div>
        ))}
        {items.length === 0 ? <div className="text-sm text-zinc-500">Kategori yok.</div> : null}
      </div>
    </div>
  );
}

