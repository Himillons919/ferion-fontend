import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getProjectForEnterprise } from "@/lib/projects";

type Params = {
  params: { id: string };
};

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
    return NextResponse.json({ project });
  } catch (error) {
    console.error("Get project error", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 },
    );
  }
}
