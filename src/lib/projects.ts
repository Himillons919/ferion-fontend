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

  await prisma.projectMilestone.createMany({
    data: milestones.map((m) => ({
      ...m,
      projectId,
    })),
    skipDuplicates: true,
  });
}
