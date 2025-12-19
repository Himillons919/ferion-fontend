import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, USER_COOKIE_NAME } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email("请输入有效邮箱"),
  password: z.string().min(1, "请输入密码"),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = loginSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { email, password } = parsed.data;
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { enterprise: true },
    });

    if (!user || user.password !== hashPassword(password)) {
      return NextResponse.json(
        { error: "邮箱或密码错误" },
        { status: 401 },
      );
    }

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        enterpriseId: user.enterpriseId,
        enterpriseName: user.enterprise?.name ?? null,
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
    console.error("Login error", error);
    return NextResponse.json(
      { error: "登录失败，请稍后再试" },
      { status: 500 },
    );
  }
}
