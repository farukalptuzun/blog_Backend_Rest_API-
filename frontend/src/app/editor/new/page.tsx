"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

export default function NewEditorPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [published, setPublished] = useState(true);
  const [status, setStatus] = useState<string>("");

  const tagList = useMemo(
    () => tags.split(",").map((t) => t.trim()).filter(Boolean),
    [tags]
  );

  async function submit() {
    setStatus("Gönderiliyor…");
    try {
      const { data } = await api.post("/posts", {
        title,
        content,
        tags: tagList,
        published,
      });
      setStatus(`Oluşturuldu: ${data?.post?._id || ""}`);
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
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
          Yayınla
        </label>
        <div className="editor-quill rounded-xl border border-border bg-card">
          <ReactQuill theme="snow" value={content} onChange={setContent} />
        </div>
        <Button onClick={submit} disabled={!hasToken}>
          Kaydet
        </Button>
        {status ? <div className="text-sm text-muted-foreground">{status}</div> : null}
        <p className="text-xs text-muted-foreground">
          Not: Bu sayfa token ister. Önce backend üzerinden login olup `accessToken`’ı tarayıcı localStorage’a yazmanız gerekir.
        </p>
      </div>
    </div>
  );
}
