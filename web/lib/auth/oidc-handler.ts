import { randomBytes, createHash } from "crypto";
import { getOIDCConfig, getOIDCCallbackURL } from "./oidc-config";
import { resolveUserRole, getOrCreateOrganizationUser } from "./role-mapper";
import { prisma } from "../prisma";

// Dynamic import to avoid Next.js static analysis issues
const getOIDCModule = async () => {
  return await import("openid-client");
};

/**
 * Generate a random code verifier for PKCE
 */
function generateCodeVerifier(): string {
  return randomBytes(32).toString("base64url");
}

/**
 * Calculate code challenge from verifier (S256 method)
 */
async function calculateCodeChallenge(verifier: string): Promise<string> {
  const hash = createHash("sha256").update(verifier).digest("base64url");
  return hash;
}

/**
 * Initialize OIDC client for an organization
 */
export async function getOIDCClient(organizationId: string, baseUrl: string) {
  const config = await getOIDCConfig(organizationId);
  if (!config) {
    throw new Error("OIDC not configured for this organization");
  }

  const oidc = await getOIDCModule();

  // Discover issuer if endpoints not provided
  let issuer: any;
  if (config.authorizationEndpoint && config.tokenEndpoint) {
    // Use provided endpoints
    issuer = new oidc.Issuer({
      issuer: config.issuer,
      authorization_endpoint: config.authorizationEndpoint,
      token_endpoint: config.tokenEndpoint,
      userinfo_endpoint: config.userInfoEndpoint,
    });
  } else {
    // Auto-discover from issuer
    issuer = await oidc.Issuer.discover(config.issuer);
  }

  const client = new issuer.Client({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uris: [getOIDCCallbackURL(baseUrl, organizationId)],
    response_types: ["code"],
  });

  return { client, config };
}

/**
 * Generate authorization URL for OIDC login
 */
export async function getAuthorizationURL(
  organizationId: string,
  baseUrl: string,
  state?: string
): Promise<{ url: string; codeVerifier: string; state: string }> {
  const { client, config } = await getOIDCClient(organizationId, baseUrl);
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await calculateCodeChallenge(codeVerifier);
  const generatedState = state || randomBytes(32).toString("base64url");

  const params = {
    redirect_uri: getOIDCCallbackURL(baseUrl, organizationId),
    scope: "openid email profile",
    state: generatedState,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  };

  if (config.audience) {
    params.audience = config.audience;
  }

  const url = client.authorizationUrl(params);

  return { url, codeVerifier, state: generatedState };
}

/**
 * Handle OIDC callback and create/update user session
 */
export async function handleOIDCCallback(
  organizationId: string,
  baseUrl: string,
  code: string,
  state: string,
  storedState: string,
  codeVerifier: string
): Promise<{ userId: string; email: string; name?: string }> {
  if (state !== storedState) {
    throw new Error("Invalid state parameter");
  }

  const { client } = await getOIDCClient(organizationId, baseUrl);

  // Exchange code for tokens
  const tokenSet = await client.callback(
    getOIDCCallbackURL(baseUrl, organizationId),
    { code, state },
    { code_verifier: codeVerifier, state }
  );

  // Get user info
  const userInfo = await client.userinfo(tokenSet.access_token!);

  const email = userInfo.email as string;
  if (!email) {
    throw new Error("Email not provided in OIDC token");
  }

  // Get or create user
  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name: (userInfo.name as string) || (userInfo.preferred_username as string) || undefined,
        emailVerified: new Date(),
      },
    });
  } else {
    // Update user info if changed
    const name = (userInfo.name as string) || (userInfo.preferred_username as string) || undefined;
    if (name && user.name !== name) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { name },
      });
    }
  }

  // Resolve role from mappings
  const groups = userInfo.groups as string[] | undefined;
  const attributes = userInfo as Record<string, any>;
  const roleResult = await resolveUserRole(organizationId, email, groups, attributes);

  // Get or create organization user with resolved role
  await getOrCreateOrganizationUser(user.id, organizationId, roleResult.role);

  return {
    userId: user.id,
    email: user.email!,
    name: user.name || undefined,
  };
}
