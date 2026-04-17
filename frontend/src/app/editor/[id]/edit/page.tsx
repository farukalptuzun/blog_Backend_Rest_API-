"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

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
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">Yazıyı düzenle</h1>
      <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
        <input
          className="w-full rounded-xl border border-border bg-transparent px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-ring"
          placeholder="Başlık"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="editor-quill rounded-xl border border-border bg-card">
          <ReactQuill theme="snow" value={content} onChange={setContent} />
        </div>
        <Button type="button" onClick={submit}>
          Kaydet
        </Button>
        {status ? <div className="text-sm text-muted-foreground">{status}</div> : null}
      </div>
    </div>
  );
}
