import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";

const authConfigSchema = z.object({
  organizationId: z.string(),
  provider: z.enum(["oidc", "saml", "credentials"]),
  enabled: z.boolean(),
  issuer: z.string().url().optional(),
  clientId: z.string().optional(),
  clientSecret: z.string().optional(),
  authorizationEndpoint: z.string().url().optional(),
  tokenEndpoint: z.string().url().optional(),
  userInfoEndpoint: z.string().url().optional(),
  audience: z.string().optional(),
});

// GET /api/admin/auth-config?organizationId=xxx
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get("organizationId");

    if (!organizationId) {
      return NextResponse.json({ error: "organizationId required" }, { status: 400 });
    }

    // Verify user has admin access to organization
    const orgUser = await prisma.organizationUser.findFirst({
      where: {
        userId: session.user.id,
        organizationId,
        role: "ORG_ADMIN",
      },
    });

    if (!orgUser) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const config = await prisma.authConfig.findUnique({
      where: { organizationId },
      include: {
        roleMappings: {
          orderBy: { priority: "desc" },
        },
      },
    });

    return NextResponse.json({ config });
  } catch (error) {
    console.error("Error fetching auth config:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/admin/auth-config
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const data = authConfigSchema.parse(body);

    // Verify user has admin access
    const orgUser = await prisma.organizationUser.findFirst({
      where: {
        userId: session.user.id,
        organizationId: data.organizationId,
        role: "ORG_ADMIN",
      },
    });

    if (!orgUser) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Encrypt client secret (simple approach - in production use proper encryption)
    const encryptedSecret = data.clientSecret;
    if (data.clientSecret && data.provider === "oidc") {
      // For now, store as-is (in production, encrypt with a key)
      // encryptedSecret = await encrypt(data.clientSecret);
    }

    // Upsert auth config
    const config = await prisma.authConfig.upsert({
      where: { organizationId: data.organizationId },
      create: {
        organizationId: data.organizationId,
        provider: data.provider,
        enabled: data.enabled,
        issuer: data.issuer,
        clientId: data.clientId,
        clientSecret: encryptedSecret,
        authorizationEndpoint: data.authorizationEndpoint,
        tokenEndpoint: data.tokenEndpoint,
        userInfoEndpoint: data.userInfoEndpoint,
        audience: data.audience,
      },
      update: {
        provider: data.provider,
        enabled: data.enabled,
        issuer: data.issuer,
        clientId: data.clientId,
        clientSecret: encryptedSecret,
        authorizationEndpoint: data.authorizationEndpoint,
        tokenEndpoint: data.tokenEndpoint,
        userInfoEndpoint: data.userInfoEndpoint,
        audience: data.audience,
      },
    });

    return NextResponse.json({ config });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error saving auth config:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
