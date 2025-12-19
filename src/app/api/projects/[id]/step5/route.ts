import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getProjectForEnterprise } from "@/lib/projects";
import { prisma } from "@/lib/prisma";
import { revenueModelSchema } from "@/lib/validators";

type Params = {
  params: { id: string };
};

export async function PUT(req: Request, { params }: Params) {
  try {
    const json = await req.json();
    const parsed = revenueModelSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const user = await getCurrentUser();
    const project = await getProjectForEnterprise(
      params.id,
      user.enterpriseId,
    );
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const data = parsed.data;
    const updated = await prisma.project.update({
      where: { id: project.id },
      data: {
        revenueMode: data.revenueMode,
        annualReturn: data.annualReturn,
        payoutFrequency: data.payoutFrequency,
        capitalProfile: data.capitalProfile,
        distributionPolicy: data.distributionPolicy,
        distributionNotes: data.distributionNotes,
        currentStep: project.currentStep < 6 ? 6 : project.currentStep,
        updatedBy: user.id,
      },
    });

    return NextResponse.json({ project: updated });
  } catch (error) {
    console.error("Step5 save error", error);
    return NextResponse.json(
      { error: "Failed to save revenue model" },
      { status: 500 },
    );
  }
}
