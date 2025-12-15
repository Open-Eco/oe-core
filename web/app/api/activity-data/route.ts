import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createActivityDataSchema = z.object({
  organizationId: z.string(),
  facilityId: z.string().optional(),
  category: z.string(),
  subcategory: z.string().optional(),
  activityType: z.string(),
  quantity: z.number().positive(),
  unit: z.string(),
  periodStart: z.string().datetime(),
  periodEnd: z.string().datetime(),
  source: z.enum(["manual", "csv_upload", "api", "ai_assistant"]).optional(),
  metadata: z.record(z.any()).optional(),
})

// GET /api/activity-data - List activity data for user's organizations
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get("organizationId")
    const facilityId = searchParams.get("facilityId")
    const category = searchParams.get("category")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    // Get user's organizations
    const userOrgs = await prisma.organizationUser.findMany({
      where: { userId: session.user.id },
      select: { organizationId: true },
    })

    const orgIds = userOrgs.map(ou => ou.organizationId)

    if (orgIds.length === 0) {
      return NextResponse.json({ data: [] })
    }

    // Build query
    const where: any = {
      organizationId: { in: orgIds },
    }

    if (organizationId && orgIds.includes(organizationId)) {
      where.organizationId = organizationId
    }

    if (facilityId) {
      where.facilityId = facilityId
    }

    if (category) {
      where.category = category
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

    const data = await prisma.rawActivityData.findMany({
      where,
      include: {
        facility: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Error fetching activity data:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/activity-data - Create new activity data entry
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const data = createActivityDataSchema.parse(body)

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

    // Verify facility belongs to organization if provided
    if (data.facilityId) {
      const facility = await prisma.facility.findFirst({
        where: {
          id: data.facilityId,
          organizationId: data.organizationId,
        },
      })

      if (!facility) {
        return NextResponse.json(
          { error: "Facility not found or access denied" },
          { status: 404 }
        )
      }
    }

    // Create activity data entry
    const activityData = await prisma.rawActivityData.create({
      data: {
        organizationId: data.organizationId,
        facilityId: data.facilityId,
        category: data.category,
        subcategory: data.subcategory,
        activityType: data.activityType,
        quantity: data.quantity,
        unit: data.unit,
        periodStart: new Date(data.periodStart),
        periodEnd: new Date(data.periodEnd),
        source: data.source || "manual",
        metadata: data.metadata,
      },
    })

    return NextResponse.json({ data: activityData }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error creating activity data:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

