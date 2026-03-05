import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/health
 * Health check endpoint for container orchestration (Docker, Kubernetes, etc.)
 * Returns 200 when the app and database are healthy, 503 otherwise.
 */
export async function GET() {
  const checks: Record<string, string> = {
    app: "ok",
  };

  let httpStatus = 200;

  // Check database connectivity
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = "ok";
  } catch {
    checks.database = "error";
    httpStatus = 503;
  }

  return NextResponse.json(
    {
      status: httpStatus === 200 ? "healthy" : "unhealthy",
      checks,
      timestamp: new Date().toISOString(),
    },
    { status: httpStatus }
  );
}
