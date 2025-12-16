import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const approveSchema = z.object({
  comment: z.string().optional(),
});

// POST /api/reporting-periods/[id]/approve - Approve a submitted period
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await Promise.resolve(context.params);
    const { id } = params;
    const body = await request.json().catch(() => ({}));
    const { comment } = approveSchema.parse(body);

    const period = await prisma.reportingPeriod.findUnique({
      where: { id },
    });

    if (!period) {
      return NextResponse.json({ error: 'Period not found' }, { status: 404 });
    }

    // Verify user is an admin (only admins can approve)
    const membership = await prisma.organizationUser.findUnique({
      where: {
        userId_organizationId: {
          userId: session.user.id,
          organizationId: period.organizationId,
        },
      },
    });

    if (!membership || membership.role !== 'ORG_ADMIN') {
      return NextResponse.json(
        { error: 'Only organization admins can approve periods' },
        { status: 403 }
      );
    }

    // Check current status
    if (period.status !== 'submitted') {
      return NextResponse.json(
        { error: `Cannot approve period with status: ${period.status}. Period must be submitted first.` },
        { status: 400 }
      );
    }

    // Update period status
    const updatedPeriod = await prisma.reportingPeriod.update({
      where: { id },
      data: {
        status: 'approved',
        approvedAt: new Date(),
        approvedBy: session.user.id,
      },
    });

    // Also approve all submitted activities in this period
    await prisma.rawActivityData.updateMany({
      where: {
        reportingPeriodId: id,
        status: 'submitted',
      },
      data: {
        status: 'approved',
        approvedAt: new Date(),
        approvedBy: session.user.id,
      },
    });

    // Log the change
    await prisma.changeEvent.create({
      data: {
        organizationId: period.organizationId,
        userId: session.user.id,
        userEmail: session.user.email || undefined,
        action: 'approve',
        resourceType: 'reporting_period',
        resourceId: id,
        changes: {
          status: { old: 'submitted', new: 'approved' },
        },
        reason: comment,
      },
    });

    // Create approval record
    await prisma.approval.create({
      data: {
        reportingPeriodId: id,
        resourceType: 'reporting_period',
        resourceId: id,
        action: 'approve',
        performedBy: session.user.id,
        comment,
        previousStatus: 'submitted',
        newStatus: 'approved',
      },
    });

    return NextResponse.json({ period: updatedPeriod });
  } catch (error) {
    console.error('Error approving reporting period:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

