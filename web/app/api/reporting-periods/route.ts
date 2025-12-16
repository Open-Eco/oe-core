import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createPeriodSchema = z.object({
  organizationId: z.string(),
  name: z.string().min(1),
  periodStart: z.string().transform((s) => new Date(s)),
  periodEnd: z.string().transform((s) => new Date(s)),
});

// GET /api/reporting-periods - List reporting periods
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');

    if (!organizationId) {
      return NextResponse.json(
        { error: 'organizationId is required' },
        { status: 400 }
      );
    }

    // Verify user has access to organization
    const membership = await prisma.organizationUser.findUnique({
      where: {
        userId_organizationId: {
          userId: session.user.id,
          organizationId,
        },
      },
    });

    if (!membership) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const periods = await prisma.reportingPeriod.findMany({
      where: { organizationId },
      orderBy: { periodStart: 'desc' },
      include: {
        _count: {
          select: { activityData: true },
        },
      },
    });

    return NextResponse.json({ periods });
  } catch (error) {
    console.error('Error fetching reporting periods:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/reporting-periods - Create a new reporting period
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = createPeriodSchema.parse(body);

    // Verify user has admin access to organization
    const membership = await prisma.organizationUser.findUnique({
      where: {
        userId_organizationId: {
          userId: session.user.id,
          organizationId: data.organizationId,
        },
      },
    });

    if (!membership || !['ORG_ADMIN'].includes(membership.role)) {
      return NextResponse.json(
        { error: 'Only organization admins can create reporting periods' },
        { status: 403 }
      );
    }

    const period = await prisma.reportingPeriod.create({
      data: {
        organizationId: data.organizationId,
        name: data.name,
        periodStart: data.periodStart,
        periodEnd: data.periodEnd,
        status: 'open',
      },
    });

    // Log the change
    await prisma.changeEvent.create({
      data: {
        organizationId: data.organizationId,
        userId: session.user.id,
        userEmail: session.user.email || undefined,
        action: 'create',
        resourceType: 'reporting_period',
        resourceId: period.id,
        changes: { created: data },
      },
    });

    return NextResponse.json({ period }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Error creating reporting period:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

