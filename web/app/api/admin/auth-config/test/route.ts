import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Force Node.js runtime (openid-client requires Node.js APIs)
export const runtime = "nodejs";

// POST /api/admin/auth-config/test
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { organizationId, issuer, clientId, clientSecret } = body;

    if (!issuer || !clientId || !clientSecret) {
      return NextResponse.json(
        { error: "Issuer, Client ID, and Client Secret are required" },
        { status: 400 }
      );
    }

    // Verify user has admin access
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

    // Test OIDC connection
    try {
      // Dynamic import to avoid Next.js static analysis issues
      // Using a minimal interface for the legacy-style API used here
      interface LegacyOIDCIssuerInstance {
        metadata: {
          issuer: string;
          authorization_endpoint?: string;
          token_endpoint?: string;
          userinfo_endpoint?: string;
        };
        Client: new (config: { client_id: string; client_secret: string }) => unknown;
      }
      interface LegacyOIDCModule {
        Issuer: { discover: (issuer: string) => Promise<LegacyOIDCIssuerInstance> };
      }
      const oidc = (await import("openid-client")) as unknown as LegacyOIDCModule;
      const discoveredIssuer = await oidc.Issuer.discover(issuer);
      
      // Verify issuer is valid
      if (!discoveredIssuer.metadata.issuer) {
        throw new Error("Invalid issuer");
      }

      // Try to create a client (this validates the configuration)
      new discoveredIssuer.Client({
        client_id: clientId,
        client_secret: clientSecret,
      });

      return NextResponse.json({
        success: true,
        message: "OIDC configuration is valid",
        issuer: discoveredIssuer.metadata.issuer,
        authorizationEndpoint: discoveredIssuer.metadata.authorization_endpoint,
        tokenEndpoint: discoveredIssuer.metadata.token_endpoint,
        userInfoEndpoint: discoveredIssuer.metadata.userinfo_endpoint,
      });
    } catch (error: unknown) {
      return NextResponse.json(
        { error: `OIDC connection failed: ${error instanceof Error ? error.message : String(error)}` },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    console.error("Error testing auth config:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
