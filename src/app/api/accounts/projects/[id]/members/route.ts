import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { getProjectForEnterprise } from "@/lib/projects";
import { prisma } from "@/lib/prisma";

type Params = {
  params: { id: string };
};

const memberSchema = z.object({
  userId: z.string().min(1, "userId is required"),
  role: z.string().min(1, "Role is required"),
});

export async function GET(_req: Request, { params }: Params) {
  try {
    const user = await getCurrentUser();
    const project = await getProjectForEnterprise(
      params.id,
      user.enterpriseId,
    );

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const members = await prisma.userProject.findMany({
      where: { projectId: project.id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            isCreator: true,
          },
        },
      },
    });

    return NextResponse.json({ members });
  } catch (error) {
    console.error("List project members error", error);
    return NextResponse.json(
      { error: "Failed to list project members" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request, { params }: Params) {
  try {
    const json = await req.json();
    const parsed = memberSchema.safeParse(json);
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

    const targetUser = await prisma.user.findUnique({
      where: { id: parsed.data.userId },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (
      targetUser.enterpriseId &&
      targetUser.enterpriseId !== user.enterpriseId
    ) {
      return NextResponse.json(
        { error: "User does not belong to this enterprise" },
        { status: 403 },
      );
    }

    const membership = await prisma.userProject.upsert({
      where: {
        userId_projectId_role: {
          userId: targetUser.id,
          projectId: project.id,
          role: parsed.data.role,
        },
      },
      create: {
        userId: targetUser.id,
        projectId: project.id,
        role: parsed.data.role,
      },
      update: {},
    });

    return NextResponse.json({ membership });
  } catch (error) {
    console.error("Add project member error", error);
    return NextResponse.json(
      { error: "Failed to add member" },
      { status: 500 },
    );
  }
}
