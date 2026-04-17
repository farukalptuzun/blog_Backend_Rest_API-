"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { api } from "@/lib/api";
import clsx from "clsx";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
};

type QuillWithToolbar = {
  quill: {
    getSelection: (focus: boolean) => { index: number } | null;
    getLength: () => number;
    insertEmbed: (index: number, type: string, value: string) => void;
    setSelection: (index: number, length: number) => void;
  };
};

export function EditorQuill({ value, onChange, placeholder, className }: Props) {
  const [uploadError, setUploadError] = useState<string | null>(null);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["blockquote", "link", "image"],
          ["clean"],
        ],
        handlers: {
          image: function (this: QuillWithToolbar) {
            const quill = this.quill;
            setUploadError(null);

            const input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/jpeg,image/png,image/webp");
            input.click();

            input.onchange = async () => {
              const file = input.files?.[0];
              if (!file) return;
              try {
                const formData = new FormData();
                formData.append("image", file);
                const { data } = await api.post<{ url: string }>("/uploads/image", formData);
                const range = quill.getSelection(true);
                const idx = range?.index ?? Math.max(0, quill.getLength() - 1);
                quill.insertEmbed(idx, "image", data.url);
                quill.setSelection(idx + 1, 0);
              } catch (e: unknown) {
                const msg =
                  (e as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message ||
                  "Fotoğraf yüklenemedi (giriş yaptığınızdan emin olun).";
                setUploadError(String(msg));
              }
            };
          },
        },
      },
    }),
    []
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "blockquote",
    "link",
    "image",
  ];

  return (
    <div className={clsx("space-y-2", className)}>
      <p className="text-xs text-muted-foreground">
        Araç çubuğundaki <strong>görsel</strong> ikonuna tıklayarak metin içine fotoğraf ekleyebilirsin.
      </p>
      {uploadError ? <p className="text-xs text-red-500 dark:text-red-400">{uploadError}</p> : null}
      <div className="editor-quill rounded-xl border border-border bg-card">
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          modules={modules}
          formats={formats}
        />
      </div>
    </div>
  );
}
