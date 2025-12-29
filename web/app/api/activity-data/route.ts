import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createActivityDataSchema = z.object({
  organizationId: z.string(),
  facilityId: z.string().optional(),
  reportingPeriodId: z.string().optional(),
  category: z.string(),
  subcategory: z.string().optional(),
  activityType: z.string(),
  quantity: z.number().positive(),
  unit: z.string(),
  periodStart: z.string().datetime(),
  periodEnd: z.string().datetime(),
  source: z.enum(["manual", "csv_upload", "api", "ai_assistant"]).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
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
    const reportingPeriodId = searchParams.get("reportingPeriodId")
    const category = searchParams.get("category")
    const status = searchParams.get("status")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    // Get user's organizations
    const userOrgs = await prisma.organizationUser.findMany({
      where: { userId: session.user.id },
      select: { organizationId: true },
    })

    const orgIds = userOrgs.map((ou: { organizationId: string }) => ou.organizationId)

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

    if (reportingPeriodId) {
      where.reportingPeriodId = reportingPeriodId
    }

    if (category) {
      where.category = category
    }

    if (status) {
      where.status = status
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
        reportingPeriod: true,
        evidence: true,
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

    // If linking to a reporting period, verify it exists and is not locked
    if (data.reportingPeriodId) {
      const period = await prisma.reportingPeriod.findFirst({
        where: {
          id: data.reportingPeriodId,
          organizationId: data.organizationId,
        },
      })

      if (!period) {
        return NextResponse.json(
          { error: "Reporting period not found" },
          { status: 404 }
        )
      }

      if (period.status === 'locked') {
        return NextResponse.json(
          { error: "Cannot add activity to a locked reporting period" },
          { status: 400 }
        )
      }

      if (period.status === 'approved') {
        return NextResponse.json(
          { error: "Cannot add activity to an approved reporting period. Please reopen or create a new period." },
          { status: 400 }
        )
      }
    }

    // Create activity data entry
    const activityData = await prisma.rawActivityData.create({
      data: {
        organizationId: data.organizationId,
        facilityId: data.facilityId,
        reportingPeriodId: data.reportingPeriodId,
        category: data.category,
        subcategory: data.subcategory,
        activityType: data.activityType,
        quantity: data.quantity,
        unit: data.unit,
        periodStart: new Date(data.periodStart),
        periodEnd: new Date(data.periodEnd),
        source: data.source || "manual",
        status: 'draft',
        metadata: data.metadata,
      },
    })

    // Log the change
    await prisma.changeEvent.create({
      data: {
        organizationId: data.organizationId,
        userId: session.user.id,
        userEmail: session.user.email || undefined,
        action: 'create',
        resourceType: 'activity_data',
        resourceId: activityData.id,
        changes: { created: data },
      },
    })

    return NextResponse.json({ data: activityData }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
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
