import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST /api/reporting-periods/[id]/submit - Submit period for approval
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

    const period = await prisma.reportingPeriod.findUnique({
      where: { id },
    });

    if (!period) {
      return NextResponse.json({ error: 'Period not found' }, { status: 404 });
    }

    // Verify user has access
    const membership = await prisma.organizationUser.findUnique({
      where: {
        userId_organizationId: {
          userId: session.user.id,
          organizationId: period.organizationId,
        },
      },
    });

    if (!membership) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Check current status
    if (period.status !== 'open') {
      return NextResponse.json(
        { error: `Cannot submit period with status: ${period.status}` },
        { status: 400 }
      );
    }

    // Update period status
    const updatedPeriod = await prisma.reportingPeriod.update({
      where: { id },
      data: {
        status: 'submitted',
        submittedAt: new Date(),
        submittedBy: session.user.id,
      },
    });

    // Also submit all draft activities in this period
    await prisma.rawActivityData.updateMany({
      where: {
        reportingPeriodId: id,
        status: 'draft',
      },
      data: {
        status: 'submitted',
        submittedAt: new Date(),
        submittedBy: session.user.id,
      },
    });

    // Log the change
    await prisma.changeEvent.create({
      data: {
        organizationId: period.organizationId,
        userId: session.user.id,
        userEmail: session.user.email || undefined,
        action: 'submit',
        resourceType: 'reporting_period',
        resourceId: id,
        changes: {
          status: { old: 'open', new: 'submitted' },
        },
      },
    });

    // Create approval record
    await prisma.approval.create({
      data: {
        reportingPeriodId: id,
        resourceType: 'reporting_period',
        resourceId: id,
        action: 'submit',
        performedBy: session.user.id,
        previousStatus: 'open',
        newStatus: 'submitted',
      },
    });

    return NextResponse.json({ period: updatedPeriod });
  } catch (error) {
    console.error('Error submitting reporting period:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

