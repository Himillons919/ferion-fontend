"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

type FormState = {
  name: string;
  email: string;
  password: string;
  enterpriseName: string;
  captcha: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    enterpriseName: "",
    captcha: "",
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
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      setLoading(false);
      if (!res.ok) {
        setError(data?.error ?? "Registration failed.");
        return;
      }
      router.push("/create");
    } catch (err) {
      console.error(err);
      setError("Registration failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-10 shadow-lg ring-1 ring-slate-100">
        <h1 className="text-center text-3xl font-semibold text-slate-700">
          Create account
        </h1>
        <p className="mt-2 text-center text-sm text-slate-500">
          Use your email to create an enterprise workspace.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm text-slate-600">Full name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => onChange("name", e.target.value)}
              className="w-full rounded-md border border-slate-300 px-4 py-3 text-slate-900 shadow-inner outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              placeholder="Jane Doe"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-slate-600">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => onChange("email", e.target.value)}
              className="w-full rounded-md border border-slate-300 px-4 py-3 text-slate-900 shadow-inner outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-slate-600">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => onChange("password", e.target.value)}
              className="w-full rounded-md border border-slate-300 px-4 py-3 text-slate-900 shadow-inner outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              placeholder="At least 6 characters"
              minLength={6}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-slate-600">Enterprise name</label>
            <input
              type="text"
              value={form.enterpriseName}
              onChange={(e) => onChange("enterpriseName", e.target.value)}
              className="w-full rounded-md border border-slate-300 px-4 py-3 text-slate-900 shadow-inner outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              placeholder="Example: CreamData Capital"
              required
            />
            <p className="text-xs text-slate-500">
              You can update the enterprise name later.
            </p>
          </div>

          <div className="grid grid-cols-[2fr,1fr] gap-3">
            <div className="space-y-2">
              <label className="block text-sm text-slate-600">Verification code</label>
              <input
                type="text"
                value={form.captcha}
                onChange={(e) => onChange("captcha", e.target.value)}
                className="w-full rounded-md border border-slate-300 px-4 py-3 text-slate-900 shadow-inner outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                placeholder="Enter the code"
              />
            </div>
            <div className="flex items-center justify-center rounded-md border border-slate-300 bg-slate-50 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-orange-500" />
                <span>Verification</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-orange-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Submitting..." : "Create account"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            href="/"
            className="font-semibold text-orange-600 hover:text-orange-700"
          >
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
