import { createHash } from "crypto";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

export const USER_COOKIE_NAME = "ferion_user_id";
const DEMO_ENTERPRISE_ID = "demo-enterprise";
const DEMO_USER_ID = "demo-user";
const DEMO_PASSWORD_HASH = createHash("sha256")
  .update("demo-password")
  .digest("hex");

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  enterpriseId: string;
  enterpriseName?: string | null;
  role: string;
  isCreator: boolean;
};

function toAuthUser(user: {
  id: string;
  email: string;
  name: string | null;
  enterpriseId: string | null;
  role: string;
  isCreator: boolean;
  enterprise?: { id: string; name: string | null } | null;
}): AuthUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name ?? "User",
    enterpriseId: user.enterpriseId ?? user.enterprise?.id ?? "",
    enterpriseName: user.enterprise?.name ?? null,
    role: user.role,
    isCreator: user.isCreator,
  };
}

// Temporary auth: prefer cookie-based user, fall back to demo user.
export async function getCurrentUser(): Promise<AuthUser> {
  const cookieStore = await cookies();
  const cookieUserId = cookieStore.get(USER_COOKIE_NAME)?.value;

  if (cookieUserId) {
    const existing = await prisma.user.findUnique({
      where: { id: cookieUserId },
      include: { enterprise: true },
    });
    if (existing && existing.enterpriseId) {
      return toAuthUser(existing);
    }
  }

  const enterprise = await prisma.enterprise.upsert({
    where: { id: DEMO_ENTERPRISE_ID },
    create: {
      id: DEMO_ENTERPRISE_ID,
      name: "Demo Enterprise",
      kybStatus: "APPROVED",
    },
    update: {},
  });

  const user = await prisma.user.upsert({
    where: { id: DEMO_USER_ID },
    create: {
      id: DEMO_USER_ID,
      email: "demo@ferion.local",
      password: DEMO_PASSWORD_HASH,
      name: "Demo User",
      enterpriseId: enterprise.id,
      role: "ISSUER_MEMBER",
      isCreator: true,
    },
    update: {
      enterpriseId: enterprise.id,
    },
  });

  if (!enterprise.creatorId) {
    await prisma.enterprise.update({
      where: { id: enterprise.id },
      data: { creatorId: user.id },
    });
  }

  return toAuthUser({ ...user, enterprise });
}

export function hashPassword(raw: string) {
  return createHash("sha256").update(raw).digest("hex");
}
