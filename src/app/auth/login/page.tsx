"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

type FormState = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onChange = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      setLoading(false);
      if (!res.ok) {
        setError(data?.error ?? "登录失败");
        return;
      }
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("登录失败，请稍后再试");
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100 px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/50 bg-white/60 p-10 shadow-2xl shadow-orange-100/60 backdrop-blur-2xl">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg">
            ☀️
          </div>
          <h1 className="mt-3 text-3xl font-bold text-slate-800">
            登录 Ferion
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            登录后进入控制台，管理你的 RWA 项目。
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm text-slate-700">邮箱或账户号</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => onChange("email", e.target.value)}
              className="w-full rounded-xl border border-white/60 bg-white/80 px-4 py-3 text-slate-900 shadow-inner outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-slate-700">密码</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => onChange("password", e.target.value)}
              className="w-full rounded-xl border border-white/60 bg-white/80 px-4 py-3 text-slate-900 shadow-inner outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              placeholder="请输入密码"
              required
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-white/70 bg-white/60 px-4 py-3 text-sm text-slate-700 shadow-inner">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>成功！</span>
            </div>
            <div className="text-right text-xs text-slate-500">
              安全验证通过
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-orange-600">
            <button
              type="button"
              className="hover:text-orange-700"
              onClick={() => alert("请联系管理员找回密码")}
            >
              忘记密码
            </button>
            <Link href="/auth/register" className="hover:text-orange-700">
              创建账户
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "登录中..." : "登录"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          如果还没有账号，请先{" "}
          <Link href="/auth/register" className="font-semibold text-orange-600">
            创建账户
          </Link>
        </div>
      </div>
    </main>
  );
}
