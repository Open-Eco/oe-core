import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/organizations/[id] - Get organization details
// Note: Next.js 16 route handlers may pass params as a Promise; keep typing flexible.
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const { id } = await context?.params

    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has access to this organization
    const orgUser = await prisma.organizationUser.findFirst({
      where: {
        userId: session.user.id,
        organizationId: id,
      },
      include: {
        organization: true,
      },
    })

    if (!orgUser) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    return NextResponse.json({ organization: orgUser.organization })
  } catch (error) {
    console.error("Error fetching organization:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

