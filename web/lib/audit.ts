import { prisma } from './prisma';

export interface AuditParams {
  organizationId?: string;
  userId: string;
  userEmail?: string | null;
  action: string;
  resourceType: string;
  resourceId: string;
  changes?: Record<string, unknown>;
  reason?: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Writes an append-only audit entry to both ChangeEvent and AuditLog.
 * Call this in every API route that mutates application state.
 */
export async function writeAuditLog(params: AuditParams): Promise<void> {
  const {
    organizationId,
    userId,
    userEmail,
    action,
    resourceType,
    resourceId,
    changes,
    reason,
    ipAddress,
    userAgent,
  } = params;

  await Promise.all([
    prisma.changeEvent.create({
      data: {
        organizationId,
        userId,
        userEmail: userEmail ?? undefined,
        action,
        resourceType,
        resourceId,
        changes: changes ?? undefined,
        reason,
        ipAddress,
        userAgent,
      },
    }),
    prisma.auditLog.create({
      data: {
        organizationId,
        userId,
        action,
        resourceType,
        resourceId,
        changes: changes ?? undefined,
        ipAddress,
        userAgent,
      },
    }),
  ]);
}
