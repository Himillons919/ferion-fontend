import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const WIZARD_STEPS = 6;

function formatCurrency(value?: number | null) {
  if (!value || Number.isNaN(value)) return "$0";
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toLocaleString()}`;
}

function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-3xl border border-white/50 bg-white/40 p-5 shadow-xl shadow-orange-100/30 backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const projects = await prisma.project.findMany({
    where: { enterpriseId: user.enterpriseId },
    orderBy: { createdAt: "desc" },
  });

  const totalAssets = projects.reduce((sum, p) => sum + (p.assetValue ?? 0), 0);
  const averageProgress =
    projects.length === 0
      ? 0
      : projects.reduce(
          (sum, p) =>
            sum + Math.round(((p.currentStep ?? 1) / WIZARD_STEPS) * 100),
          0,
        ) / projects.length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 flex-shrink-0 lg:block">
          <div className="sticky top-0 h-screen p-6">
            <GlassCard className="h-full flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-orange-500/90 p-3 text-white shadow-lg">
                  ☀️
                </div>
                <div>
                  <p className="text-xs uppercase text-orange-500 font-semibold">
                    Ferion
                  </p>
                  <p className="text-base font-semibold text-slate-800">
                    Issuer Console
                  </p>
                </div>
              </div>
              <nav className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                <a className="rounded-2xl bg-white/70 px-4 py-3 shadow-sm text-orange-600">
                  Overview
                </a>
                <a className="rounded-2xl px-4 py-3 hover:bg-white/60">
                  Digital Assets
                </a>
                <a className="rounded-2xl px-4 py-3 hover:bg-white/60">
                  Offerings
                </a>
                <a className="rounded-2xl px-4 py-3 hover:bg-white/60">
                  Investors
                </a>
                <a className="rounded-2xl px-4 py-3 hover:bg-white/60">
                  Workflow
                </a>
                <a className="rounded-2xl px-4 py-3 hover:bg-white/60">
                  Documents
                </a>
              </nav>
              <div className="mt-auto space-y-3 text-sm text-slate-600">
                <a className="flex items-center justify-between rounded-2xl bg-white/50 px-4 py-3 hover:bg-white/70">
                  <span>Request a service</span>
                  <span>↗</span>
                </a>
                <a className="flex items-center justify-between rounded-2xl bg-white/50 px-4 py-3 hover:bg-white/70">
                  <span>Go live mode</span>
                  <span>↗</span>
                </a>
              </div>
            </GlassCard>
          </div>
        </aside>

        <section className="flex-1 p-4 sm:p-6 lg:p-8">
          <header className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-600">Welcome, {user.name}</p>
              <h1 className="text-3xl font-bold text-slate-900">Overview</h1>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/create"
                className="rounded-2xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-orange-600"
              >
                + New Project
              </a>
              <a
                href="/projects"
                className="rounded-2xl border border-white/70 bg-white/60 px-4 py-2 text-sm font-semibold text-orange-600 shadow-sm backdrop-blur"
              >
                My Projects
              </a>
            </div>
          </header>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <GlassCard>
              <p className="text-sm text-slate-600">Total assets</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {formatCurrency(totalAssets)}
              </p>
              <p className="text-xs text-orange-600 font-semibold">
                Covering {projects.length} project
                {projects.length === 1 ? "" : "s"}
              </p>
            </GlassCard>
            <GlassCard>
              <p className="text-sm text-slate-600">Average progress</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {averageProgress.toFixed(1)}%
              </p>
              <div className="mt-3 h-2 w-full rounded-full bg-white/60">
                <div
                  className="h-full rounded-full bg-orange-500"
                  style={{
                    width: `${Math.min(100, Math.max(0, averageProgress))}%`,
                  }}
                />
              </div>
            </GlassCard>
            <GlassCard>
              <p className="text-sm text-slate-600">Projects</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {projects.length}
              </p>
              <p className="text-xs text-orange-600 font-semibold">
                Active in portfolio
              </p>
            </GlassCard>
            <GlassCard>
              <p className="text-sm text-slate-600">Tokens</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {projects.length > 0 ? projects.length : 0}
              </p>
              <p className="text-xs text-orange-600 font-semibold">
                Token configs ready
              </p>
            </GlassCard>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-3">
            <GlassCard className="xl:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">New digital assets</p>
                  <p className="text-lg font-semibold text-slate-900">
                    Recent drafts
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="rounded-full bg-white/70 px-3 py-1">
                    Monthly
                  </span>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-sm text-slate-700">
                {projects.slice(0, 6).map((p) => (
                  <div
                    key={p.id}
                    className="rounded-2xl border border-white/60 bg-white/60 px-4 py-3 shadow-sm"
                  >
                    <p className="font-semibold text-slate-900 truncate">
                      {p.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {p.assetType || "Asset"}
                    </p>
                    <p className="mt-1 text-xs text-orange-600 font-semibold">
                      {formatCurrency(p.assetValue)}
                    </p>
                  </div>
                ))}
                {projects.length === 0 && (
                  <div className="col-span-3 text-center text-slate-500">
                    暂无数据
                  </div>
                )}
              </div>
            </GlassCard>

            <GlassCard>
              <p className="text-sm text-slate-600">% TVL / Chains</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="h-24 w-24 rounded-full bg-white/70 p-3 shadow-inner">
                  <div className="flex h-full items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-200 text-lg font-bold text-white shadow-lg">
                    {projects.length}
                  </div>
                </div>
                <div className="space-y-2 text-sm text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-orange-500" />
                    <span>Ethereum</span>
                    <span className="text-xs text-slate-500">45%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-orange-300" />
                    <span>Polygon</span>
                    <span className="text-xs text-slate-500">25%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-orange-200" />
                    <span>Others</span>
                    <span className="text-xs text-slate-500">30%</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Your Projects
              </h2>
              <a
                href="/projects"
                className="text-sm font-semibold text-orange-600 hover:text-orange-700"
              >
                View all →
              </a>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {projects.map((project) => {
                const progress = Math.round(
                  ((project.currentStep ?? 1) / WIZARD_STEPS) * 100,
                );
                return (
                  <GlassCard key={project.id}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-slate-500">
                          {project.assetType || "Asset"}
                        </p>
                        <h3 className="text-lg font-semibold text-slate-900">
                          {project.name}
                        </h3>
                        <p className="text-sm text-slate-600 line-clamp-2">
                          {project.description || "No description provided"}
                        </p>
                      </div>
                      <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-orange-600">
                        Draft
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-700">
                      <div>
                        <p className="text-slate-500">Total Value</p>
                        <p className="font-semibold">
                          {formatCurrency(project.assetValue)}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500">Progress</p>
                        <p className="font-semibold">{progress}%</p>
                        <div className="mt-2 h-2 w-full rounded-full bg-white/60">
                          <div
                            className="h-full rounded-full bg-orange-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <a
                        href={`/projects/${project.id}`}
                        className="font-semibold text-orange-600 hover:text-orange-700"
                      >
                        View details →
                      </a>
                      <span className="text-xs text-slate-500">
                        Created {project.createdAt.toISOString().slice(0, 10)}
                      </span>
                    </div>
                  </GlassCard>
                );
              })}
              {projects.length === 0 && (
                <GlassCard>
                  <div className="text-center text-slate-600">
                    还没有项目，点击右上角「+ New Project」开始创建。
                  </div>
                </GlassCard>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
