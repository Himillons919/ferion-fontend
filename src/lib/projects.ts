import { prisma } from "./prisma";

export async function getProjectForEnterprise(
  projectId: string,
  enterpriseId: string,
) {
  return prisma.project.findFirst({
    where: { id: projectId, enterpriseId },
    include: {
      files: true,
      milestones: true,
      tokens: true,
      invitations: true,
      members: { include: { user: true } },
    },
  });
}

export async function ensureMilestones(projectId: string) {
  const milestones = [
    { milestone: "ProjectPlanning", status: "InProgress" },
    { milestone: "LegalDocuments", status: "Pending" },
    { milestone: "SmartContract", status: "Pending" },
    { milestone: "SecurityAudit", status: "Pending" },
    { milestone: "PublishToken", status: "Pending" },
  ];
  const existing = await prisma.projectMilestone.findMany({
    where: { projectId },
    select: { milestone: true },
  });
  const existingSet = new Set(existing.map((item) => item.milestone));
  const missing = milestones.filter((item) => !existingSet.has(item.milestone));
  if (missing.length === 0) return;

  await Promise.all(
    missing.map((item) =>
      prisma.projectMilestone.create({
        data: {
          projectId,
          milestone: item.milestone,
          status: item.status,
        },
      }),
    ),
  );
}
