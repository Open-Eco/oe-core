import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeAuditLog } from '@/lib/audit';
import { z } from 'zod';

const createDatasetSchema = z.object({
  name: z.string().min(1),
  version: z.string().min(1),
  description: z.string().optional(),
});

const createFactorSchema = z.object({
  datasetVersionId: z.string(),
  category: z.string().min(1),
  subcategory: z.string().optional(),
  activityType: z.string().min(1),
  factor: z.number().positive(),
  unit: z.string().min(1),
  region: z.string().optional(),
  source: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

// GET /api/factors — list datasets and their factors
// Query params:
//   ?datasetVersionId=<id>  — filter by dataset
//   ?category=<string>      — filter by category
//   ?activityType=<string>  — filter by activity type
//   ?region=<string>        — filter by region
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const datasetVersionId = searchParams.get('datasetVersionId');
    const category = searchParams.get('category');
    const activityType = searchParams.get('activityType');
    const region = searchParams.get('region');
    const listDatasets = searchParams.get('datasets') === 'true';

    if (listDatasets) {
      const datasets = await prisma.datasetVersion.findMany({
        orderBy: [{ isActive: 'desc' }, { publishedAt: 'desc' }],
        include: { _count: { select: { emissionFactors: true } } },
      });
      return NextResponse.json({ datasets });
    }

    const where: Record<string, unknown> = {};
    if (datasetVersionId) where.datasetVersionId = datasetVersionId;
    if (category) where.category = category;
    if (activityType) where.activityType = activityType;
    if (region) where.region = region;

    const factors = await prisma.emissionFactor.findMany({
      where,
      include: { datasetVersion: { select: { name: true, version: true } } },
      orderBy: [{ category: 'asc' }, { activityType: 'asc' }],
      take: 200,
    });

    return NextResponse.json({ factors });
  } catch (error) {
    console.error('Error fetching factors:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/factors — create a dataset or a factor
// To create a dataset: body must include { type: "dataset", ...createDatasetSchema }
// To create a factor:  body must include { type: "factor",  ...createFactorSchema }
// Restricted to ORG_ADMIN of any organization (system admin check is approximate here;
// a dedicated system-admin role should be added in a future iteration).
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only org admins may manage factors
    const adminMembership = await prisma.organizationUser.findFirst({
      where: { userId: session.user.id, role: 'ORG_ADMIN' },
    });
    if (!adminMembership) {
      return NextResponse.json(
        { error: 'Only organization admins can manage emission factors' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { type, ...rest } = body;

    if (type === 'dataset') {
      const data = createDatasetSchema.parse(rest);
      const dataset = await prisma.datasetVersion.create({ data });
      await writeAuditLog({
        userId: session.user.id,
        userEmail: session.user.email,
        action: 'create',
        resourceType: 'dataset_version',
        resourceId: dataset.id,
        changes: { created: data },
      });
      return NextResponse.json({ dataset }, { status: 201 });
    }

    if (type === 'factor') {
      const data = createFactorSchema.parse(rest);
      const factor = await prisma.emissionFactor.create({
        data: {
          datasetVersionId: data.datasetVersionId,
          category: data.category,
          subcategory: data.subcategory,
          activityType: data.activityType,
          factor: data.factor,
          unit: data.unit,
          region: data.region,
          source: data.source,
          metadata: data.metadata,
        },
        include: { datasetVersion: { select: { name: true, version: true } } },
      });
      await writeAuditLog({
        userId: session.user.id,
        userEmail: session.user.email,
        action: 'create',
        resourceType: 'emission_factor',
        resourceId: factor.id,
        changes: { created: data },
      });
      return NextResponse.json({ factor }, { status: 201 });
    }

    return NextResponse.json(
      { error: 'type must be "dataset" or "factor"' },
      { status: 400 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Error creating factor:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
