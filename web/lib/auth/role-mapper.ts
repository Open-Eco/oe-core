import { prisma } from "../prisma";

export interface RoleMappingResult {
  role: string;
  matchedBy: string; // "email_domain", "group", "attribute", "default"
}

/**
 * Resolve user role based on role mappings and OIDC token claims
 */
export async function resolveUserRole(
  organizationId: string,
  email: string,
  groups?: string[],
  attributes?: Record<string, any>
): Promise<RoleMappingResult> {
  // Get all role mappings for this organization's auth config
  const authConfig = await prisma.authConfig.findUnique({
    where: { organizationId },
    include: {
      roleMappings: {
        orderBy: { priority: "desc" }, // Higher priority first
      },
    },
  });

  if (!authConfig || !authConfig.enabled) {
    // No auth config or not enabled - return default
    return { role: "ORG_MEMBER", matchedBy: "default" };
  }

  // Check role mappings in priority order
  for (const mapping of authConfig.roleMappings) {
    let matched = false;

    switch (mapping.type) {
      case "email_domain":
        // Match email domain (e.g., "@acme.com")
        if (email && email.endsWith(mapping.matchValue)) {
          matched = true;
        }
        break;

      case "group":
        // Match group from OIDC token
        if (groups && groups.includes(mapping.matchValue)) {
          matched = true;
        }
        break;

      case "attribute":
        // Match custom attribute (future)
        // Format: "key=value" or just "key"
        if (attributes) {
          const [key, value] = mapping.matchValue.split("=");
          if (value) {
            // Exact match: key=value
            if (attributes[key] === value) {
              matched = true;
            }
          } else {
            // Key exists
            if (attributes[key] !== undefined) {
              matched = true;
            }
          }
        }
        break;
    }

    if (matched) {
      return {
        role: mapping.role,
        matchedBy: mapping.type,
      };
    }
  }

  // No match found - return default role
  return { role: "ORG_MEMBER", matchedBy: "default" };
}

/**
 * Get or create OrganizationUser with resolved role
 */
export async function getOrCreateOrganizationUser(
  userId: string,
  organizationId: string,
  role: string
) {
  // Check if user already has access to this organization
  const existing = await prisma.organizationUser.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId,
      },
    },
  });

  if (existing) {
    // Update role if it changed
    if (existing.role !== role) {
      return await prisma.organizationUser.update({
        where: { id: existing.id },
        data: { role },
      });
    }
    return existing;
  }

  // Create new organization user
  return await prisma.organizationUser.create({
    data: {
      userId,
      organizationId,
      role,
    },
  });
}
