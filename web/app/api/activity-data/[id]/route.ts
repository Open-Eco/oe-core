import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateActivityDataSchema = z.object({
  facilityId: z.string().optional().nullable(),
  reportingPeriodId: z.string().optional().nullable(),
  category: z.string().optional(),
  subcategory: z.string().optional().nullable(),
  activityType: z.string().optional(),
  quantity: z.number().positive().optional(),
  unit: z.string().optional(),
  periodStart: z.string().datetime().optional(),
  periodEnd: z.string().datetime().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
})

// GET /api/activity-data/[id] - Get a single activity data entry
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const params = await Promise.resolve(context.params)
    const { id } = params

    const activity = await prisma.rawActivityData.findUnique({
      where: { id },
      include: {
        facility: true,
        reportingPeriod: true,
        evidence: true,
        emissions: true,
      },
    })

    if (!activity) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 })
    }

    // Verify user has access
    const membership = await prisma.organizationUser.findUnique({
      where: {
        userId_organizationId: {
          userId: session.user.id,
          organizationId: activity.organizationId,
        },
      },
    })

    if (!membership) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    return NextResponse.json({ data: activity })
  } catch (error) {
    console.error("Error fetching activity data:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PATCH /api/activity-data/[id] - Update an activity data entry
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const params = await Promise.resolve(context.params)
    const { id } = params
    const body = await request.json()
    const updates = updateActivityDataSchema.parse(body)

    const activity = await prisma.rawActivityData.findUnique({
      where: { id },
      include: { reportingPeriod: true },
    })

    if (!activity) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 })
    }

    // Verify user has access
    const membership = await prisma.organizationUser.findUnique({
      where: {
        userId_organizationId: {
          userId: session.user.id,
          organizationId: activity.organizationId,
        },
      },
    })

    if (!membership) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Check if activity or period is locked/approved
    if (activity.status === 'approved') {
      return NextResponse.json(
        { error: "Cannot edit approved activity data" },
        { status: 400 }
      )
    }

    if (activity.reportingPeriod?.status === 'locked') {
      return NextResponse.json(
        { error: "Cannot edit activity in a locked reporting period" },
        { status: 400 }
      )
    }

    if (activity.reportingPeriod?.status === 'approved') {
      return NextResponse.json(
        { error: "Cannot edit activity in an approved reporting period" },
        { status: 400 }
      )
    }

    // If changing reporting period, verify new period is not locked
    if (updates.reportingPeriodId && updates.reportingPeriodId !== activity.reportingPeriodId) {
      const newPeriod = await prisma.reportingPeriod.findFirst({
        where: {
          id: updates.reportingPeriodId,
          organizationId: activity.organizationId,
        },
      })

      if (!newPeriod) {
        return NextResponse.json(
          { error: "Reporting period not found" },
          { status: 404 }
        )
      }

      if (newPeriod.status === 'locked' || newPeriod.status === 'approved') {
        return NextResponse.json(
          { error: "Cannot move activity to a locked or approved period" },
          { status: 400 }
        )
      }
    }

    // Build update data
    const updateData: any = {}
    if (updates.facilityId !== undefined) updateData.facilityId = updates.facilityId
    if (updates.reportingPeriodId !== undefined) updateData.reportingPeriodId = updates.reportingPeriodId
    if (updates.category) updateData.category = updates.category
    if (updates.subcategory !== undefined) updateData.subcategory = updates.subcategory
    if (updates.activityType) updateData.activityType = updates.activityType
    if (updates.quantity) updateData.quantity = updates.quantity
    if (updates.unit) updateData.unit = updates.unit
    if (updates.periodStart) updateData.periodStart = new Date(updates.periodStart)
    if (updates.periodEnd) updateData.periodEnd = new Date(updates.periodEnd)
    if (updates.metadata !== undefined) updateData.metadata = updates.metadata

    // If activity was submitted and user edits it, revert to draft
    if (activity.status === 'submitted') {
      updateData.status = 'draft'
      updateData.submittedAt = null
      updateData.submittedBy = null
    }

    const updatedActivity = await prisma.rawActivityData.update({
      where: { id },
      data: updateData,
      include: {
        facility: true,
        reportingPeriod: true,
        evidence: true,
      },
    })

    // Log the change
    await prisma.changeEvent.create({
      data: {
        organizationId: activity.organizationId,
        userId: session.user.id,
        userEmail: session.user.email || undefined,
        action: 'update',
        resourceType: 'activity_data',
        resourceId: id,
        changes: {
          before: {
            category: activity.category,
            activityType: activity.activityType,
            quantity: activity.quantity,
            unit: activity.unit,
            status: activity.status,
          },
          after: updateData,
        },
      },
    })

    return NextResponse.json({ data: updatedActivity })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      )
    }
    console.error("Error updating activity data:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE /api/activity-data/[id] - Delete an activity data entry
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const params = await Promise.resolve(context.params)
    const { id } = params

    const activity = await prisma.rawActivityData.findUnique({
      where: { id },
      include: { reportingPeriod: true },
    })

    if (!activity) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 })
    }

    // Verify user has access (only admins can delete)
    const membership = await prisma.organizationUser.findUnique({
      where: {
        userId_organizationId: {
          userId: session.user.id,
          organizationId: activity.organizationId,
        },
      },
    })

    if (!membership || membership.role !== 'ORG_ADMIN') {
      return NextResponse.json(
        { error: "Only organization admins can delete activity data" },
        { status: 403 }
      )
    }

    // Cannot delete approved activity
    if (activity.status === 'approved') {
      return NextResponse.json(
        { error: "Cannot delete approved activity data" },
        { status: 400 }
      )
    }

    // Cannot delete from locked period
    if (activity.reportingPeriod?.status === 'locked') {
      return NextResponse.json(
        { error: "Cannot delete activity from a locked reporting period" },
        { status: 400 }
      )
    }

    // Log the deletion before deleting
    await prisma.changeEvent.create({
      data: {
        organizationId: activity.organizationId,
        userId: session.user.id,
        userEmail: session.user.email || undefined,
        action: 'delete',
        resourceType: 'activity_data',
        resourceId: id,
        changes: {
          deleted: {
            category: activity.category,
            activityType: activity.activityType,
            quantity: activity.quantity,
            unit: activity.unit,
            status: activity.status,
          },
        },
      },
    })

    await prisma.rawActivityData.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting activity data:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

