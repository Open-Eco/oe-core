import { prisma } from "../prisma";

export interface OIDCConfig {
  issuer: string;
  clientId: string;
  clientSecret: string;
  authorizationEndpoint?: string;
  tokenEndpoint?: string;
  userInfoEndpoint?: string;
  audience?: string;
}

/**
 * Get OIDC configuration for an organization
 */
export async function getOIDCConfig(organizationId: string): Promise<OIDCConfig | null> {
  const authConfig = await prisma.authConfig.findUnique({
    where: { organizationId },
  });

  if (!authConfig || !authConfig.enabled || authConfig.provider !== "oidc") {
    return null;
  }

  if (!authConfig.issuer || !authConfig.clientId || !authConfig.clientSecret) {
    return null;
  }

  return {
    issuer: authConfig.issuer,
    clientId: authConfig.clientId,
    clientSecret: authConfig.clientSecret,
    authorizationEndpoint: authConfig.authorizationEndpoint || undefined,
    tokenEndpoint: authConfig.tokenEndpoint || undefined,
    userInfoEndpoint: authConfig.userInfoEndpoint || undefined,
    audience: authConfig.audience || undefined,
  };
}

/**
 * Get callback URL for OIDC
 */
export function getOIDCCallbackURL(baseUrl: string, organizationId?: string): string {
  const url = `${baseUrl}/api/auth/oidc/callback`;
  if (organizationId) {
    return `${url}?organizationId=${organizationId}`;
  }
  return url;
}

/**
 * Get redirect URI to display to admin for IdP configuration
 */
export function getOIDCRedirectURI(baseUrl: string, organizationId: string): string {
  return getOIDCCallbackURL(baseUrl, organizationId);
}
