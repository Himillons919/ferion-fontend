import type { ReactNode } from "react";
import "@/app/globals.css";

export const metadata = {
  title: "Ferion Auth",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        {children}
      </body>
    </html>
  );
}
