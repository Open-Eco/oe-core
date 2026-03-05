import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for API routes, auth pages, setup, and static files.
  // NOTE: /api/* (including /api/health) and /auth/* (including /auth/signin)
  // are intentionally public — no authentication is enforced for these paths.
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/setup") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname === "/" ||
    pathname.startsWith("/demo") ||
    pathname.startsWith("/docs")
  ) {
    return NextResponse.next();
  }

  // Check if setup is needed via API call
  // This avoids Prisma in edge runtime
  if (!pathname.startsWith("/setup") && !pathname.startsWith("/admin")) {
    try {
      const setupUrl = new URL("/api/setup", request.url);
      const setupResponse = await fetch(setupUrl, {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      });
      
      if (setupResponse.ok) {
        const data = await setupResponse.json();
        if (!data.isComplete) {
          return NextResponse.redirect(new URL("/setup", request.url));
        }
      }
    } catch (error) {
      // If check fails, allow request through
      console.error("Setup check error:", error);
    }
  }

  // Enforce authentication: redirect unauthenticated users to sign-in
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    const signInUrl = new URL("/auth/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
