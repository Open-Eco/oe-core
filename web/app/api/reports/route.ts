import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createReportSchema = z.object({
  organizationId: z.string(),
  title: z.string().min(1),
  type: z.enum(["annual_summary", "esg_report", "csrd", "tcfd"]),
  periodStart: z.string().datetime(),
  periodEnd: z.string().datetime(),
  metadata: z.record(z.any()).optional(),
})

// GET /api/reports - List reports for user's organizations
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get("organizationId")
    const status = searchParams.get("status")

    // Get user's organizations
    const userOrgs = await prisma.organizationUser.findMany({
      where: { userId: session.user.id },
      select: { organizationId: true },
    })

    const orgIds = userOrgs.map(ou => ou.organizationId)

    if (orgIds.length === 0) {
      return NextResponse.json({ reports: [] })
    }

    const where: any = {
      organizationId: { in: orgIds },
    }

    if (organizationId && orgIds.includes(organizationId)) {
      where.organizationId = organizationId
    }

    if (status) {
      where.status = status
    }

    const reports = await prisma.report.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ reports })
  } catch (error) {
    console.error("Error fetching reports:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/reports - Create new report
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const data = createReportSchema.parse(body)

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

    // Create report
    const report = await prisma.report.create({
      data: {
        organizationId: data.organizationId,
        title: data.title,
        type: data.type,
        periodStart: new Date(data.periodStart),
        periodEnd: new Date(data.periodEnd),
        status: "draft",
        metadata: data.metadata,
      },
    })

    return NextResponse.json({ report }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error creating report:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

