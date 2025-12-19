import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { getCurrentUser } from "@/lib/auth";
import { getProjectForEnterprise } from "@/lib/projects";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type Params = {
  params: { id: string };
};

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

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
    const documents = await prisma.projectFile.findMany({
      where: { projectId: project.id },
    });
    return NextResponse.json({ documents });
  } catch (error) {
    console.error("List documents error", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request, { params }: Params) {
  try {
    const user = await getCurrentUser();
    const project = await getProjectForEnterprise(
      params.id,
      user.enterpriseId,
    );
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "File is required" },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Unsupported file type" },
        { status: 400 },
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large (max 10MB)" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filename = `${Date.now()}-${safeName}`;
    const filePath = path.join(uploadsDir, filename);
    await fs.writeFile(filePath, buffer);

    const url = `/uploads/${filename}`;
    const document = await prisma.projectFile.create({
      data: {
        projectId: project.id,
        fileName: file.name,
        url,
        size: buffer.length,
        uploader: user.id,
        type: file.type,
        status: "Draft",
        origin: "Creating-Step3",
      },
    });

    return NextResponse.json({ document });
  } catch (error) {
    console.error("Upload document error", error);
    return NextResponse.json(
      { error: "Failed to upload document" },
      { status: 500 },
    );
  }
}
