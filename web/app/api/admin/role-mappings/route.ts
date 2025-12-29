import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const roleMappingSchema = z.object({
  id: z.string().optional(),
  type: z.enum(["email_domain", "group", "attribute"]),
  matchValue: z.string().min(1),
  role: z.string(),
  priority: z.number().int(),
});

const roleMappingsSchema = z.object({
  authConfigId: z.string(),
  organizationId: z.string().optional(), // For fallback lookup
  mappings: z.array(roleMappingSchema),
});

// GET /api/admin/role-mappings?authConfigId=xxx
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const authConfigId = searchParams.get("authConfigId");

    if (!authConfigId) {
      return NextResponse.json({ error: "authConfigId required" }, { status: 400 });
    }

    // Verify user has admin access
    const authConfig = await prisma.authConfig.findUnique({
      where: { id: authConfigId },
      include: { organization: true },
    });

    if (!authConfig) {
      return NextResponse.json({ error: "Auth config not found" }, { status: 404 });
    }

    const orgUser = await prisma.organizationUser.findFirst({
      where: {
        userId: session.user.id,
        organizationId: authConfig.organizationId,
        role: "ORG_ADMIN",
      },
    });

    if (!orgUser) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const mappings = await prisma.roleMapping.findMany({
      where: { authConfigId },
      orderBy: { priority: "desc" },
    });

    return NextResponse.json({ mappings });
  } catch (error: any) {
    console.error("Error fetching role mappings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/admin/role-mappings
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const data = roleMappingsSchema.parse(body);

    // Get or create auth config
    let authConfig = await prisma.authConfig.findUnique({
      where: { id: data.authConfigId },
      include: { organization: true },
    });

    // If auth config doesn't exist, try to find by organization
    if (!authConfig && data.organizationId) {
      authConfig = await prisma.authConfig.findUnique({
        where: { organizationId: data.organizationId },
        include: { organization: true },
      });
      
      // Update authConfigId if we found it by organization
      if (authConfig) {
        data.authConfigId = authConfig.id;
      }
    }

    if (!authConfig) {
      return NextResponse.json({ error: "Auth config not found. Please configure OIDC first." }, { status: 404 });
    }

    const orgUser = await prisma.organizationUser.findFirst({
      where: {
        userId: session.user.id,
        organizationId: authConfig.organizationId,
        role: "ORG_ADMIN",
      },
    });

    if (!orgUser) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete existing mappings
    await prisma.roleMapping.deleteMany({
      where: { authConfigId: data.authConfigId },
    });

    // Create new mappings
    const created = await prisma.roleMapping.createMany({
      data: data.mappings.map((m) => ({
        authConfigId: data.authConfigId,
        type: m.type,
        matchValue: m.matchValue,
        role: m.role,
        priority: m.priority,
      })),
    });

    const mappings = await prisma.roleMapping.findMany({
      where: { authConfigId: data.authConfigId },
      orderBy: { priority: "desc" },
    });

    return NextResponse.json({ mappings, count: created.count });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error saving role mappings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
