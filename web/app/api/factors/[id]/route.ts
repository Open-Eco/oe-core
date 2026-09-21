import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeAuditLog } from '@/lib/audit';
import { z } from 'zod';

const updateFactorSchema = z.object({
  category: z.string().min(1).optional(),
  subcategory: z.string().optional(),
  activityType: z.string().min(1).optional(),
  factor: z.number().positive().optional(),
  unit: z.string().min(1).optional(),
  region: z.string().optional(),
  source: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

// GET /api/factors/[id] — get a single emission factor with its dataset
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await Promise.resolve(context.params);

    const factor = await prisma.emissionFactor.findUnique({
      where: { id },
      include: { datasetVersion: true },
    });

    if (!factor) {
      return NextResponse.json({ error: 'Factor not found' }, { status: 404 });
    }

    return NextResponse.json({ factor });
  } catch (error) {
    console.error('Error fetching factor:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/factors/[id] — update an emission factor (admin only)
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Authorization: any ORG_ADMIN may manage the global factor library.
    // TODO: introduce a dedicated SYSTEM_ADMIN role before multi-tenant production use.
    const adminMembership = await prisma.organizationUser.findFirst({
      where: { userId: session.user.id, role: 'ORG_ADMIN' },
    });
    if (!adminMembership) {
      return NextResponse.json(
        { error: 'Only organization admins can update emission factors' },
        { status: 403 }
      );
    }

    const { id } = await Promise.resolve(context.params);
    const existing = await prisma.emissionFactor.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Factor not found' }, { status: 404 });
    }

    const body = await request.json();
    const data = updateFactorSchema.parse(body);

    const factor = await prisma.emissionFactor.update({
      where: { id },
      data,
      include: { datasetVersion: { select: { name: true, version: true } } },
    });

    await writeAuditLog({
      userId: session.user.id,
      userEmail: session.user.email,
      action: 'update',
      resourceType: 'emission_factor',
      resourceId: id,
      changes: { old: existing, new: data },
    });

    return NextResponse.json({ factor });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Error updating factor:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/factors/[id] — delete an emission factor (admin only)
export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminMembership = await prisma.organizationUser.findFirst({
      where: { userId: session.user.id, role: 'ORG_ADMIN' },
    });
    if (!adminMembership) {
      return NextResponse.json(
        { error: 'Only organization admins can delete emission factors' },
        { status: 403 }
      );
    }

    const { id } = await Promise.resolve(context.params);
    const existing = await prisma.emissionFactor.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Factor not found' }, { status: 404 });
    }

    await prisma.emissionFactor.delete({ where: { id } });

    await writeAuditLog({
      userId: session.user.id,
      userEmail: session.user.email,
      action: 'delete',
      resourceType: 'emission_factor',
      resourceId: id,
      changes: { deleted: existing },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting factor:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
