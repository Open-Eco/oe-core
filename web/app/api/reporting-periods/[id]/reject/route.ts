import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const rejectSchema = z.object({
  comment: z.string().min(1, 'A reason is required when rejecting'),
});

// POST /api/reporting-periods/[id]/reject - Reject a submitted period (returns to open)
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
    const body = await request.json();
    const { comment } = rejectSchema.parse(body);

    const period = await prisma.reportingPeriod.findUnique({
      where: { id },
    });

    if (!period) {
      return NextResponse.json({ error: 'Period not found' }, { status: 404 });
    }

    // Verify user is an admin
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
        { error: 'Only organization admins can reject periods' },
        { status: 403 }
      );
    }

    // Check current status
    if (period.status !== 'submitted') {
      return NextResponse.json(
        { error: `Cannot reject period with status: ${period.status}. Period must be submitted.` },
        { status: 400 }
      );
    }

    // Update period status back to open
    const updatedPeriod = await prisma.reportingPeriod.update({
      where: { id },
      data: {
        status: 'open',
        submittedAt: null,
        submittedBy: null,
      },
    });

    // Also revert all submitted activities back to draft
    await prisma.rawActivityData.updateMany({
      where: {
        reportingPeriodId: id,
        status: 'submitted',
      },
      data: {
        status: 'draft',
        submittedAt: null,
        submittedBy: null,
      },
    });

    // Log the change
    await prisma.changeEvent.create({
      data: {
        organizationId: period.organizationId,
        userId: session.user.id,
        userEmail: session.user.email || undefined,
        action: 'reject',
        resourceType: 'reporting_period',
        resourceId: id,
        changes: {
          status: { old: 'submitted', new: 'open' },
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
        action: 'reject',
        performedBy: session.user.id,
        comment,
        previousStatus: 'submitted',
        newStatus: 'open',
      },
    });

    return NextResponse.json({ period: updatedPeriod });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Error rejecting reporting period:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

