"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { EditorQuill } from "@/components/editor-quill";

export default function EditEditorPage() {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<string>("");
  const [coverFile, setCoverFile] = useState<File | null>(null);

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
      if (coverFile) {
        setStatus("Kapak yükleniyor…");
        const fd = new FormData();
        fd.append("cover", coverFile);
        await api.post(`/posts/${id}/cover`, fd);
        setCoverFile(null);
      }
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
        <label className="flex flex-col gap-1.5 text-sm text-muted-foreground">
          <span>Kapak fotoğrafını değiştir (isteğe bağlı)</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="text-xs text-foreground file:mr-2 file:rounded-lg file:border file:border-border file:bg-muted file:px-3 file:py-1.5"
            onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
          />
        </label>
        <EditorQuill value={content} onChange={setContent} placeholder="İçerik…" />
        <Button type="button" onClick={submit}>
          Kaydet
        </Button>
        {status ? <div className="text-sm text-muted-foreground">{status}</div> : null}
      </div>
    </div>
  );
}
