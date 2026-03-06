import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { Prisma } from "@prisma/client"

const createEmissionSchema = z.object({
  organizationId: z.string(),
  scope: z.enum(["1", "2", "3"]),
  category: z.string(),
  co2e: z.number().positive(),
  periodStart: z.string().datetime(),
  periodEnd: z.string().datetime(),
  methodology: z.string(),
  datasetVersion: z.string(),
  activityDataId: z.string().optional(),
})

// GET /api/emissions - List emissions for user's organizations
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get("organizationId")
    const scope = searchParams.get("scope")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    // Get user's organizations
    const userOrgs = await prisma.organizationUser.findMany({
      where: { userId: session.user.id },
      select: { organizationId: true },
    })

    const orgIds = userOrgs.map((ou: { organizationId: string }) => ou.organizationId)

    if (orgIds.length === 0) {
      return NextResponse.json({ emissions: [] })
    }

    // Build query
    const where: Prisma.EmissionResultWhereInput = {
      organizationId: { in: orgIds },
    }

    if (organizationId && orgIds.includes(organizationId)) {
      where.organizationId = organizationId
    }

    if (scope) {
      where.scope = scope
    }

    if (startDate || endDate) {
      where.AND = []
      if (startDate) {
        where.AND.push({ periodStart: { gte: new Date(startDate) } })
      }
      if (endDate) {
        where.AND.push({ periodEnd: { lte: new Date(endDate) } })
      }
    }

    const emissions = await prisma.emissionResult.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100, // Limit results
    })

    return NextResponse.json({ emissions })
  } catch (error) {
    console.error("Error fetching emissions:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/emissions - Create emission result (typically from calculation)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const data = createEmissionSchema.parse(body)

    // Verify user has access to organization
    const orgUser = await prisma.organizationUser.findFirst({
      where: {
        userId: session.user.id,
        organizationId: data.organizationId,
      },
    })

    if (!orgUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Create emission result (append-only)
    const emission = await prisma.emissionResult.create({
      data: {
        organizationId: data.organizationId,
        scope: data.scope,
        category: data.category,
        co2e: data.co2e,
        periodStart: new Date(data.periodStart),
        periodEnd: new Date(data.periodEnd),
        methodology: data.methodology,
        datasetVersion: data.datasetVersion,
        activityDataId: data.activityDataId,
      },
    })

    return NextResponse.json({ emission }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Error creating emission:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

