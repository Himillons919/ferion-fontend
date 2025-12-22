import Link from "next/link";
import { Home, Plus } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RailProject = {
  id: string;
  name: string;
  tokenSymbol: string | null;
};

function getProjectSymbol(project: RailProject) {
  const tokenSymbol = project.tokenSymbol?.trim();
  if (tokenSymbol) {
    return tokenSymbol.slice(0, 4).toUpperCase();
  }

  const name = project.name?.trim();
  if (!name) return "PRJ";

  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("");

  const fallback = initials || name.replace(/\s+/g, "");
  return fallback.slice(0, 4).toUpperCase();
}

export default async function ProjectRail() {
  const user = await getCurrentUser();
  const projects = user.enterpriseId
    ? await prisma.project.findMany({
        where: { enterpriseId: user.enterpriseId },
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, tokenSymbol: true },
      })
    : [];

  const railButtonBase =
    "flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-xl transition sm:h-12 sm:w-12";
  const railFloatShadow =
    "shadow-[0_12px_30px_rgba(255,142,90,0.26)] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(255,140,80,0.35)]";
  const railProjectRing =
    "flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-300 via-amber-100 to-white p-[1px] shadow-[0_16px_34px_rgba(255,140,90,0.32)] transition hover:-translate-y-0.5 sm:h-12 sm:w-12";
  const railProjectInner =
    "flex h-full w-full items-center justify-center rounded-full bg-white/80 text-[9px] font-semibold uppercase text-slate-700 backdrop-blur-xl sm:text-[10px]";

  return (
    <aside className="console-rail fixed left-4 top-6 z-50 flex h-[calc(100vh-3rem)] w-16 flex-col items-center sm:left-5">
      <nav className="flex flex-col items-center gap-4">
        <Link
          href="/dashboard"
          aria-label="Home"
          className={`${railButtonBase} ${railFloatShadow} border border-white/60 bg-white/75 text-[color:var(--console-accent)] ring-1 ring-white/50 hover:bg-white/90`}
        >
          <Home className="h-5 w-5" />
        </Link>

        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/dashboard?projectId=${project.id}`}
            aria-label={project.name}
            title={project.name}
            className={railProjectRing}
          >
            <span className={railProjectInner}>
              {getProjectSymbol(project)}
            </span>
          </Link>
        ))}

        <Link
          href="/create"
          aria-label="Create new project"
          className={`${railButtonBase} ${railFloatShadow} border border-dashed border-white/70 bg-white/55 text-[color:var(--console-muted)] hover:bg-white/80`}
        >
          <Plus className="h-5 w-5" />
        </Link>
      </nav>
    </aside>
  );
}
