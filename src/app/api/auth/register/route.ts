import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, USER_COOKIE_NAME } from "@/lib/auth";

const registerSchema = z.object({
  email: z.string().email("请输入有效邮箱"),
  password: z.string().min(6, "密码至少 6 位"),
  name: z.string().min(1, "请输入姓名"),
  enterpriseName: z.string().min(1, "请输入机构名称"),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = registerSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { email, password, name, enterpriseName } = parsed.data;

    const exists = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (exists) {
      return NextResponse.json(
        { error: "该邮箱已注册，请直接登录" },
        { status: 409 },
      );
    }

    const enterprise = await prisma.enterprise.create({
      data: {
        name: enterpriseName.trim(),
        kybStatus: "PENDING",
      },
    });

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashPassword(password),
        name: name.trim(),
        enterpriseId: enterprise.id,
        role: "OWNER",
        isCreator: true,
      },
    });

    await prisma.enterprise.update({
      where: { id: enterprise.id },
      data: { creatorId: user.id },
    });

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        enterpriseId: enterprise.id,
        enterpriseName: enterprise.name,
        role: user.role,
        isCreator: user.isCreator,
      },
    });
    response.cookies.set({
      name: USER_COOKIE_NAME,
      value: user.id,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return response;
  } catch (error) {
    console.error("Register error", error);
    return NextResponse.json(
      { error: "注册失败，请稍后再试" },
      { status: 500 },
    );
  }
}
