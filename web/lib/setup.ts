import { prisma } from "./prisma";

/**
 * Check if this is a fresh deployment (no organizations exist)
 */
export async function isFreshDeployment(): Promise<boolean> {
  const orgCount = await prisma.organization.count();
  return orgCount === 0;
}

/**
 * Check if setup is complete (at least one organization exists)
 */
export async function isSetupComplete(): Promise<boolean> {
  return !(await isFreshDeployment());
}
