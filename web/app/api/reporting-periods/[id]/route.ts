import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/reporting-periods/[id] - Get a single reporting period
export async function GET(
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
      include: {
        organization: true,
        activityData: {
          include: {
            facility: true,
          },
        },
        _count: {
          select: { activityData: true, approvals: true },
        },
      },
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

    return NextResponse.json({ period });
  } catch (error) {
    console.error('Error fetching reporting period:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

