import { NextRequest, NextResponse } from "next/server";
import { handleOIDCCallback } from "@/lib/auth/oidc-handler";

// Force Node.js runtime (openid-client requires Node.js APIs)
export const runtime = "nodejs";

/**
 * GET /api/auth/oidc/callback?code=xxx&state=xxx&organizationId=xxx
 * Handles OIDC callback and creates user session
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const organizationId = searchParams.get("organizationId");

    if (!code || !state || !organizationId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Get stored state and code verifier from cookies
    const storedState = request.cookies.get(`oidc_${organizationId}_state`)?.value;
    const codeVerifier = request.cookies.get(`oidc_${organizationId}_verifier`)?.value;

    if (!storedState || !codeVerifier) {
      return NextResponse.json(
        { error: "Missing OIDC session data" },
        { status: 400 }
      );
    }

    // Get base URL
    const baseUrl = process.env.NEXTAUTH_URL || request.headers.get("origin") || "";

    // Handle callback
    const { userId, email, name } = await handleOIDCCallback(
      organizationId,
      baseUrl,
      code,
      state,
      storedState,
      codeVerifier
    );

    // Clear OIDC cookies
    const response = NextResponse.redirect(new URL(`/auth/oidc/complete?userId=${userId}`, baseUrl));
    response.cookies.delete(`oidc_${organizationId}_verifier`);
    response.cookies.delete(`oidc_${organizationId}_state`);

    return response;
  } catch (error: unknown) {
    console.error("OIDC callback error:", error);
    return NextResponse.redirect(
      new URL(`/auth/signin?error=${encodeURIComponent(error instanceof Error ? error.message : 'Unknown error')}`, request.url)
    );
  }
}
