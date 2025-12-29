import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAuthorizationURL } from "@/lib/auth/oidc-handler";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/auth/oidc/authorize?organizationId=xxx
 * Initiates OIDC authorization flow
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get("organizationId");

    if (!organizationId) {
      return NextResponse.json({ error: "organizationId required" }, { status: 400 });
    }

    // Verify organization exists
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    // Get base URL
    const baseUrl = process.env.NEXTAUTH_URL || request.headers.get("origin") || "";

    // Generate authorization URL
    const { url, codeVerifier, state } = await getAuthorizationURL(organizationId, baseUrl);

    // Store code verifier and state in session or database
    // For now, we'll return them to be stored client-side
    // In production, store in encrypted session or database
    const response = NextResponse.redirect(url);
    
    // Store in httpOnly cookie for security
    response.cookies.set(`oidc_${organizationId}_verifier`, codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600, // 10 minutes
    });
    response.cookies.set(`oidc_${organizationId}_state`, state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600,
    });

    return response;
  } catch (error: any) {
    console.error("OIDC authorization error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to initiate OIDC flow" },
      { status: 500 }
    );
  }
}
