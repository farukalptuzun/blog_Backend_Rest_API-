"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type User = {
  _id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  createdAt: string;
};

export default function AdminUsersPage() {
  const [items, setItems] = useState<User[]>([]);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    api
      .get<{ items: User[] }>("/admin/users")
      .then((r) => setItems(r.data.items || []))
      .catch((e) => setStatus(e?.response?.data?.error?.message || "Yetki yok"));
  }, []);

  async function setRole(id: string, role: "user" | "admin") {
    setStatus("Güncelleniyor…");
    try {
      await api.patch(`/admin/users/${id}/role`, { role });
      const r = await api.get<{ items: User[] }>("/admin/users");
      setItems(r.data.items || []);
      setStatus("Tamam");
    } catch (e: any) {
      setStatus(e?.response?.data?.error?.message || "Hata");
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Kullanıcılar</h1>
      {status ? <div className="text-sm text-zinc-500">{status}</div> : null}
      <div className="overflow-hidden rounded-2xl border bg-white dark:bg-black">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-left dark:bg-zinc-950">
            <tr>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">İsim</th>
              <th className="px-4 py-2">Rol</th>
              <th className="px-4 py-2">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {items.map((u) => (
              <tr key={u._id} className="border-t">
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">{u.name}</td>
                <td className="px-4 py-2">{u.role}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <button
                      className="rounded-full border px-3 py-1 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                      onClick={() => setRole(u._id, "admin")}
                      type="button"
                    >
                      Admin yap
                    </button>
                    <button
                      className="rounded-full border px-3 py-1 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                      onClick={() => setRole(u._id, "user")}
                      type="button"
                    >
                      User yap
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 ? (
              <tr>
                <td className="px-4 py-4 text-zinc-500" colSpan={4}>
                  Kayıt yok.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

