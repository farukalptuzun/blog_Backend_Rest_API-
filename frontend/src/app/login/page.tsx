"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { login } from "@/store/slices/auth-slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string>("");

  function safeNextPath(): string {
    if (typeof window === "undefined") return "/";
    const raw = new URLSearchParams(window.location.search).get("next");
    if (raw && raw.startsWith("/") && !raw.startsWith("//")) return raw;
    return "/";
  }

  async function submit() {
    setStatus("Giriş yapılıyor…");
    try {
      await dispatch(login({ email, password })).unwrap();
      setStatus("Tamam");
      router.replace(safeNextPath());
    } catch (e: any) {
      setStatus(e?.message || "Giriş başarısız");
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <Card className="p-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Giriş</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Admin dahil tüm kullanıcılar aynı giriş ekranını kullanır.
        </p>

        <div className="mt-5 space-y-3">
          <Input placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input
            placeholder="Şifre"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button className="w-full" onClick={submit}>
            Giriş yap
          </Button>
          {status ? <div className="text-sm text-muted-foreground">{status}</div> : null}
        </div>

        <div className="mt-6 text-sm text-muted-foreground">
          Hesabın yok mu?{" "}
          <Link className="underline underline-offset-4" href="/register">
            Kayıt ol
          </Link>
        </div>
      </Card>
    </div>
  );
}

