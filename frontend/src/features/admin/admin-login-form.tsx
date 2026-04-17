"use client";

import { useState } from "react";
import Link from "next/link";
import { useAppDispatch } from "@/store/hooks";
import { login } from "@/store/slices/auth-slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export function AdminLoginForm() {
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("Giriş yapılıyor…");
    try {
      await dispatch(login({ username: username.trim(), password })).unwrap();
      setStatus("Tamam");
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err ? String((err as { message?: string }).message) : "Giriş başarısız";
      setStatus(msg);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <Card className="p-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Admin girişi</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Paneli kullanmak için yönetici kullanıcı adı ve şifrenizi girin. Varsayılan hesap sunucu tarafında
          oluşturulur (kullanıcı adı <code className="rounded bg-muted px-1">admin</code>, şifre{" "}
          <code className="rounded bg-muted px-1">1234</code>).
        </p>

        <form onSubmit={submit} className="mt-5 space-y-3">
          <Input
            placeholder="Kullanıcı adı"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            placeholder="Şifre"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button className="w-full" type="submit">
            Giriş yap
          </Button>
          {status ? <div className="text-sm text-muted-foreground">{status}</div> : null}
        </form>

        <div className="mt-6 text-sm text-muted-foreground">
          <Link className="underline underline-offset-4" href="/">
            Ana sayfaya dön
          </Link>
        </div>
      </Card>
    </div>
  );
}
