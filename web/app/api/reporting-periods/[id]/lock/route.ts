import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const lockSchema = z.object({
  reason: z.string().optional(),
});

// POST /api/reporting-periods/[id]/lock - Lock an approved period (makes it immutable)
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
    const { reason } = lockSchema.parse(body);

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
        { error: 'Only organization admins can lock periods' },
        { status: 403 }
      );
    }

    // Check current status - can only lock approved periods
    if (period.status !== 'approved') {
      return NextResponse.json(
        { error: `Cannot lock period with status: ${period.status}. Period must be approved first.` },
        { status: 400 }
      );
    }

    // Update period status
    const updatedPeriod = await prisma.reportingPeriod.update({
      where: { id },
      data: {
        status: 'locked',
        lockedAt: new Date(),
        lockedBy: session.user.id,
        lockReason: reason,
      },
    });

    // Log the change
    await prisma.changeEvent.create({
      data: {
        organizationId: period.organizationId,
        userId: session.user.id,
        userEmail: session.user.email || undefined,
        action: 'lock',
        resourceType: 'reporting_period',
        resourceId: id,
        changes: {
          status: { old: 'approved', new: 'locked' },
        },
        reason,
      },
    });

    // Create approval record
    await prisma.approval.create({
      data: {
        reportingPeriodId: id,
        resourceType: 'reporting_period',
        resourceId: id,
        action: 'lock',
        performedBy: session.user.id,
        comment: reason,
        previousStatus: 'approved',
        newStatus: 'locked',
      },
    });

    return NextResponse.json({ period: updatedPeriod });
  } catch (error) {
    console.error('Error locking reporting period:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

