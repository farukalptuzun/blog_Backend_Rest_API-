"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

export default function EditEditorPage() {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    api
      .get(`/posts/${id}`)
      .then((r) => {
        setTitle(r.data?.post?.title || "");
        setContent(r.data?.post?.content || "");
      })
      .catch(() => {});
  }, [id]);

  async function submit() {
    setStatus("Kaydediliyor…");
    try {
      await api.patch(`/posts/${id}`, { title, content });
      setStatus("Kaydedildi");
    } catch (e: any) {
      setStatus(e?.response?.data?.error?.message || "Hata");
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Yazıyı düzenle</h1>
      <div className="space-y-3 rounded-2xl border bg-white p-4 dark:bg-black">
        <input
          className="w-full rounded-xl border px-3 py-2 bg-transparent"
          placeholder="Başlık"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="rounded-xl border bg-white dark:bg-black">
          <ReactQuill theme="snow" value={content} onChange={setContent} />
        </div>
        <button
          type="button"
          onClick={submit}
          className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Kaydet
        </button>
        {status ? <div className="text-sm text-zinc-500">{status}</div> : null}
      </div>
    </div>
  );
}

