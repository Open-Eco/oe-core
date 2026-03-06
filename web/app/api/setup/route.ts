import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";

const setupSchema = z.object({
  organizationName: z.string().min(1),
  organizationSlug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  adminName: z.string().min(1),
  adminEmail: z.string().email(),
  adminPassword: z.string().min(8).optional(), // Optional if OIDC is configured
});

// GET /api/setup - Check setup status
export async function GET(request: NextRequest) {
  try {
    const orgCount = await prisma.organization.count();
    return NextResponse.json({
      isComplete: orgCount > 0,
      organizationCount: orgCount,
    });
  } catch (error: unknown) {
    console.error("Error checking setup status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/setup - Complete initial setup
export async function POST(request: NextRequest) {
  try {
    // Check if setup is already complete
    const orgCount = await prisma.organization.count();
    if (orgCount > 0) {
      return NextResponse.json(
        { error: "Setup already completed" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const data = setupSchema.parse(body);

    // Create organization
    const organization = await prisma.organization.create({
      data: {
        name: data.organizationName,
        slug: data.organizationSlug,
      },
    });

    // Create admin user (if password provided)
    let adminUser = null;
    if (data.adminPassword) {
      const hashedPassword = await bcrypt.hash(data.adminPassword, 10);
      adminUser = await prisma.user.create({
        data: {
          name: data.adminName,
          email: data.adminEmail,
          password: hashedPassword,
          emailVerified: new Date(),
        },
      });

      // Add user to organization as admin
      await prisma.organizationUser.create({
        data: {
          userId: adminUser.id,
          organizationId: organization.id,
          role: "ORG_ADMIN",
        },
      });
    }

    return NextResponse.json({
      organization,
      adminUser: adminUser
        ? {
            id: adminUser.id,
            email: adminUser.email,
            name: adminUser.name,
          }
        : null,
      message: "Setup completed successfully",
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }

    // Handle unique constraint violations
    const prismaError = error as { code?: string; meta?: { target?: string[] } };
    if (prismaError.code === "P2002") {
      if (prismaError.meta?.target?.includes("slug")) {
        return NextResponse.json(
          { error: "Organization slug already exists" },
          { status: 400 }
        );
      }
      if (prismaError.meta?.target?.includes("email")) {
        return NextResponse.json(
          { error: "Email already registered" },
          { status: 400 }
        );
      }
    }

    console.error("Error during setup:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
