"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { EditorQuill } from "@/components/editor-quill";

export default function NewEditorPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [published, setPublished] = useState(true);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");

  const tagList = useMemo(
    () => tags.split(",").map((t) => t.trim()).filter(Boolean),
    [tags]
  );

  async function submit() {
    setStatus("Gönderiliyor…");
    try {
      const { data } = await api.post<{ post: { _id: string } }>("/posts", {
        title,
        content,
        tags: tagList,
        published,
      });
      const postId = data?.post?._id;
      if (postId && coverFile) {
        setStatus("Kapak yükleniyor…");
        const fd = new FormData();
        fd.append("cover", coverFile);
        await api.post(`/posts/${postId}/cover`, fd);
      }
      setStatus(`Oluşturuldu: ${postId || ""}`);
    } catch (e: any) {
      setStatus(e?.response?.data?.error?.message || "Hata");
    }
  }

  const hasToken = typeof window !== "undefined" && !!window.localStorage.getItem("accessToken");

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">Yeni yazı</h1>
      {!hasToken ? (
        <div className="rounded-2xl border border-border bg-card p-4 text-sm text-foreground">
          Bu sayfayı kullanmak için giriş yapmalısın.{" "}
          <Link className="underline underline-offset-4" href="/login">
            Giriş
          </Link>
        </div>
      ) : null}
      <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
        <input
          className="w-full rounded-xl border border-border bg-transparent px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-ring"
          placeholder="Başlık"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="w-full rounded-xl border border-border bg-transparent px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-ring"
          placeholder="Etiketler (virgül ile) örn: node, express"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <label className="flex flex-col gap-1.5 text-sm text-muted-foreground">
          <span>Kapak fotoğrafı (isteğe bağlı)</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="text-xs text-foreground file:mr-2 file:rounded-lg file:border file:border-border file:bg-muted file:px-3 file:py-1.5"
            onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
          Yayınla
        </label>
        <EditorQuill value={content} onChange={setContent} placeholder="Yazın…" />
        <Button onClick={submit} disabled={!hasToken}>
          Kaydet
        </Button>
        {status ? <div className="text-sm text-muted-foreground">{status}</div> : null}
        <p className="text-xs text-muted-foreground">
          Metin içi fotoğraflar için araç çubuğundaki görsel ikonunu kullan. Giriş yapmış olman gerekir.
        </p>
      </div>
    </div>
  );
}
