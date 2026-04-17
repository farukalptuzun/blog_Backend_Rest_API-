"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";

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
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">Kategoriler</h1>
      <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
        <div className="flex flex-col gap-2 md:flex-row">
          <Input className="flex-1" placeholder="Kategori adı" value={name} onChange={(e) => setName(e.target.value)} />
          <button
            type="button"
            onClick={create}
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Ekle
          </button>
        </div>
        {status ? <div className="text-sm text-muted-foreground">{status}</div> : null}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {items.map((c) => (
          <div key={c._id} className="rounded-2xl border border-border bg-card p-4">
            <div className="font-medium text-foreground">{c.name}</div>
            <div className="text-xs text-muted-foreground">{c.slug}</div>
          </div>
        ))}
        {items.length === 0 ? <div className="text-sm text-muted-foreground">Kategori yok.</div> : null}
      </div>
    </div>
  );
}
