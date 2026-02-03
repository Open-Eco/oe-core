# OpenEco Authentication Guide

## Overview

OpenEco uses **federated authentication** - it does NOT manage user identities. Organizations use **Keycloak as an open-source IdP bridge** that connects to their existing identity providers (Azure AD, Okta, Google Workspace, etc.), and OpenEco trusts identity assertions from Keycloak.

### Key Principles

- **No Identity Management**: OpenEco does not store passwords or manage user accounts
- **IdP Bridge Pattern**: Keycloak acts as a bridge between OpenEco and your organization's IdP
- **Self-Hosted**: You own and control all components (OpenEco + Keycloak + your IdP)
- **Flexible Deployment**: Keycloak can run embedded, as sidecar, or externally
- **Role Mapping**: Users are automatically assigned roles based on email domain, groups, or attributes

### Critical Architecture Point

**You host one Keycloak instance, but each organization brings their own IdP.**

- Organization A connects their Azure AD to Keycloak
- Organization B connects their Okta to Keycloak  
- Organization C connects their Google Workspace to Keycloak
- Keycloak federates all of these and presents a single OIDC endpoint to OpenEco

---

## Architecture

### Authentication Flow (IdP Bridge Pattern)

```
User → OpenEco → Keycloak (IdP Bridge) → Organization's IdP (Azure AD/Okta/Google/etc.)
                                      ↓
                                  User authenticates
                                      ↓
                                  IdP returns token to Keycloak
                                      ↓
                                  Keycloak issues OIDC token to OpenEco
                                      ↓
OpenEco verifies token → Maps roles → Creates session
```

### Self-Hosted Stack

```
┌─────────────────────────────────────────────────────────────┐
│              Organization Infrastructure                    │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   OpenEco    │  │  Keycloak    │  │  Org's IdP   │     │
│  │  (Web App)   │  │ (IdP Bridge) │  │ (Azure AD/   │     │
│  │              │  │              │  │  Okta/etc.)  │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                 │                 │             │
│         └─────────┬───────┴─────────────────┘             │
│                   │                                       │
│         ┌─────────▼─────────┐                            │
│         │   PostgreSQL      │                            │
│         │  (OpenEco DB)     │                            │
│         └───────────────────┘                            │
└─────────────────────────────────────────────────────────────┘
```

**Key Points:**
- **Keycloak as IdP Bridge**: Industry-standard open-source identity provider
  - ✅ Supports OIDC + SAML
  - ✅ Actively maintained (used by Red Hat, governments, NGOs)
  - ✅ Zero license cost
  - ✅ Can run embedded, as sidecar, or externally
- **Each Org Brings Their Own IdP**: Organization connects their existing IdP (Azure AD, Okta, etc.) to Keycloak
- **Single Keycloak Instance**: One Keycloak instance federates multiple organization IdPs
- **Organization owns and controls all components**
- **OpenEco provides Helm/Docker templates for deployment**
- **No external dependencies for authentication**
- **Aligns with AGPL + public-good ethos**

---

## Supported Identity Providers

OpenEco connects to **Keycloak** (open-source IdP bridge). Keycloak then federates to your organization's existing IdP:

| Provider Type | Examples | Protocol | Status |
|---------------|----------|----------|--------|
| **Cloud IAM** | Azure AD, Google Workspace, AWS IAM | OIDC/SAML → Keycloak → OpenEco | ✅ Supported |
| **Enterprise SSO** | Okta, Auth0 | OIDC/SAML → Keycloak → OpenEco | ✅ Supported |
| **Enterprise Directory** | Active Directory | LDAP → Keycloak → OpenEco | ✅ Supported |
| **Self-Hosted** | Keycloak (standalone) | OIDC | ✅ Supported |
| **Local Auth** | Email/password (dev only) | Credentials | ⚠️ Development only |

**Keycloak Features:**
- ✅ **OIDC + SAML support** - Connects to virtually any IdP
- ✅ **Industry standard** - Used by Red Hat, governments, NGOs
- ✅ **Actively maintained** - Regular security updates
- ✅ **Zero license cost** - Fully open-source
- ✅ **Flexible deployment** - Embedded, sidecar, or external

---

## Quick Start: Keycloak + OpenEco

### Step 1: Deploy Keycloak (IdP Bridge)

Keycloak can be deployed in three ways:

**Option A: Embedded (Same Pod/Container as OpenEco)**
- Keycloak runs alongside OpenEco in the same deployment
- Best for: Single-tenant deployments, simplified infrastructure

**Option B: Sidecar (Same Namespace/Network)**
- Keycloak runs as a sidecar container
- Best for: Kubernetes deployments, shared infrastructure

**Option C: External (Dedicated Instance)**
- Keycloak runs as a separate service
- Best for: Multi-tenant deployments, centralized identity management

**Deployment Commands:**

**Docker Compose (Recommended for Pilots):**

```bash
cd deploy/keycloak

# Create .env file
cat > .env << EOF
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=your-secure-password
KEYCLOAK_DB_PASSWORD=your-db-password
KEYCLOAK_HOSTNAME=keycloak.yourcompany.com
KEYCLOAK_PORT=8080
EOF

# Start Keycloak
docker-compose up -d
# or
podman-compose up -d
```

**Kubernetes/OKD:**

```bash
kubectl apply -f deploy/okd/keycloak/deployment.yaml
```

See [deploy/keycloak/README.md](./deploy/keycloak/README.md) for detailed instructions.

### Step 2: Configure Keycloak as IdP Bridge

1. **Access Admin Console**
   - Navigate to `https://keycloak.yourcompany.com`
   - Sign in with admin credentials

2. **Create Realm**
   - Click "Create Realm"
   - Name: `your-company` (or your organization name)
   - Click "Create"

3. **Connect Your Organization's IdP (Identity Provider)**

   **For Azure AD:**
   - Go to "Identity Providers" → "Add provider" → "OpenID Connect v1.0"
   - Alias: `azure-ad`
   - Discovery Endpoint: `https://login.microsoftonline.com/{tenant-id}/.well-known/openid-configuration`
   - Client ID: `[from Azure AD]`
   - Client Secret: `[from Azure AD]`
   - Click "Save"

   **For Okta:**
   - Go to "Identity Providers" → "Add provider" → "OpenID Connect v1.0"
   - Alias: `okta`
   - Discovery Endpoint: `https://{your-domain}.okta.com/.well-known/openid-configuration`
   - Client ID: `[from Okta]`
   - Client Secret: `[from Okta]`
   - Click "Save"

   **For Google Workspace:**
   - Go to "Identity Providers" → "Add provider" → "Google"
   - Client ID: `[from Google Cloud Console]`
   - Client Secret: `[from Google Cloud Console]`
   - Click "Save"

   **For Active Directory (LDAP):**
   - Go to "User Federation" → "Add provider" → "ldap"
   - Configure LDAP connection details
   - Click "Save"

4. **Create Client for OpenEco**
   - Go to "Clients" → "Create client"
   - Client ID: `openeco`
   - Client protocol: `openid-connect`
   - Click "Next"
   - Access Type: `confidential`
   - Valid Redirect URIs: `https://climate.yourcompany.com/api/auth/oidc/callback?organizationId=*`
   - Web Origins: `https://climate.yourcompany.com`
   - Click "Save"
   - Go to "Credentials" tab
   - Copy the "Secret" value (you'll need this for OpenEco config)

5. **Configure User Groups (Optional)**
   - Go to "Groups" → "Create group"
   - Create groups like: `sustainability-team`, `admins`, etc.
   - Assign users to groups (users can come from your IdP)
   - These groups can be used for role mapping in OpenEco

### Step 3: Configure OpenEco

1. **Access OpenEco Admin Panel**
   - Sign in to OpenEco (first-time setup creates admin account)
   - Go to **Admin → Authentication**

2. **Enter OIDC Configuration**
   - **Issuer**: `https://keycloak.yourcompany.com/realms/your-company`
   - **Client ID**: `openeco`
   - **Client Secret**: `[paste from Keycloak]`
   - **Audience**: `openeco` (if required by your IdP)

3. **Test Connection**
   - Click "Test Connection"
   - If successful, you'll see: "Connection successful! OIDC configuration is valid."

4. **Enable OIDC**
   - Check "Enable OIDC Authentication"
   - Click "Save Configuration"

5. **Configure Role Mappings**
   - Scroll to "Role Mappings" section
   - Add mappings:
     - **Email Domain**: `@yourcompany.com` → `ORG_ADMIN` (Priority: 10)
     - **Group**: `sustainability-team` → `ORG_MEMBER` (Priority: 5)
     - **Default**: No match → `ORG_MEMBER` (Priority: 0)

6. **Save Mappings**
   - Click "Save Mappings"

### Step 4: Test Authentication

1. Sign out of OpenEco
2. Go to sign-in page
3. Click "Sign in with Identity Provider"
4. You should be redirected to Keycloak
5. Sign in with your Keycloak credentials
6. You should be redirected back to OpenEco and signed in

---

## Admin Configuration UI

### Accessing Authentication Settings

1. Sign in to OpenEco as an Organization Administrator
2. Navigate to **Admin → Authentication**
3. You'll see two sections:
   - **OIDC Configuration**: Set up your identity provider
   - **Role Mappings**: Configure how users are assigned roles

### OIDC Configuration Form

The form displays connection information you'll need for your IdP:

- **Redirect URI**: Copy this and paste into your IdP's client configuration
- **Audience**: Usually matches your Client ID

**Required Fields:**
- Issuer URL (e.g., `https://keycloak.example.com/realms/my-realm`)
- Client ID
- Client Secret

**Optional Fields:**
- Authorization Endpoint (auto-discovered if not provided)
- Token Endpoint (auto-discovered if not provided)
- User Info Endpoint (auto-discovered if not provided)
- Audience (if required by your IdP)

### Role Mapping

Role mappings determine which role a user gets when they sign in. Mappings are checked in priority order (higher priority first).

**Mapping Types:**

1. **Email Domain** (`email_domain`)
   - Matches users by email domain
   - Example: `@acme.com` → `ORG_ADMIN`
   - Use case: All users from your company domain get admin access

2. **Group** (`group`)
   - Matches users by group membership (from OIDC token)
   - Example: `sustainability-team` → `ORG_MEMBER`
   - Use case: Users in specific groups get specific roles

3. **Attribute** (`attribute`) - Future
   - Matches users by custom attributes
   - Example: `department=sustainability` → `ORG_MEMBER`
   - Use case: Fine-grained role assignment

**Priority:**
- Higher priority mappings are checked first
- First match wins
- If no match, default role is `ORG_MEMBER`

**Example Configuration:**

| Priority | Type | Match Value | Role |
|----------|------|-------------|------|
| 10 | email_domain | @acme.com | ORG_ADMIN |
| 5 | group | sustainability-team | ORG_MEMBER |
| 5 | group | admins | ORG_ADMIN |
| 0 | (default) | - | ORG_MEMBER |

---

## First-Time Setup Flow

When you first deploy OpenEco, you'll be guided through setup:

1. **Visit OpenEco URL**
   - If no organizations exist, you'll be redirected to `/setup`

2. **Create Organization**
   - Enter organization name and slug
   - Enter administrator details (name, email)
   - Optionally create a password (skip if using OIDC only)

3. **Complete Setup**
   - Organization is created
   - First admin user is created (if password provided)
   - You're redirected to sign in or authentication config

4. **Configure Authentication (Optional)**
   - If you skipped password creation, go to Admin → Authentication
   - Configure OIDC
   - Users can then sign in via your identity provider

---

## Integration Examples

### Keycloak as IdP Bridge

**Flow:** Organization's IdP → Keycloak → OpenEco

**Step 1: Connect Your IdP to Keycloak**

**For Azure AD:**
- In Keycloak: "Identity Providers" → "Add provider" → "OpenID Connect v1.0"
- Discovery Endpoint: `https://login.microsoftonline.com/{tenant-id}/.well-known/openid-configuration`
- Client ID: `[from Azure AD App Registration]`
- Client Secret: `[from Azure AD App Registration]`

**For Okta:**
- In Keycloak: "Identity Providers" → "Add provider" → "OpenID Connect v1.0"
- Discovery Endpoint: `https://{your-domain}.okta.com/.well-known/openid-configuration`
- Client ID: `[from Okta Application]`
- Client Secret: `[from Okta Application]`

**For Google Workspace:**
- In Keycloak: "Identity Providers" → "Add provider" → "Google"
- Client ID: `[from Google Cloud Console]`
- Client Secret: `[from Google Cloud Console]`

**Step 2: Configure Keycloak Client for OpenEco**

**Keycloak Client Configuration:**
```
Client ID: openeco
Client Protocol: openid-connect
Access Type: confidential
Valid Redirect URIs: https://climate.yourcompany.com/api/auth/oidc/callback?organizationId=*
Web Origins: https://climate.yourcompany.com
```

**Step 3: Configure OpenEco**

**OpenEco Configuration:**
```
Issuer: https://keycloak.yourcompany.com/realms/your-company
Client ID: openeco
Client Secret: [from Keycloak]
Audience: openeco
```

**Note:** OpenEco only connects to Keycloak. Your organization's IdP (Azure AD, Okta, etc.) connects to Keycloak, not directly to OpenEco.

---

## Role Mapping Examples

### Example 1: Email Domain-Based

**Scenario**: All users from your company domain should be admins.

**Configuration:**
```
Priority: 10
Type: email_domain
Match Value: @acme.com
Role: ORG_ADMIN
```

**Result**: Any user with email ending in `@acme.com` gets `ORG_ADMIN` role.

### Example 2: Group-Based

**Scenario**: Users in "sustainability-team" group get member access.

**Configuration:**
```
Priority: 5
Type: group
Match Value: sustainability-team
Role: ORG_MEMBER
```

**Result**: Users in the `sustainability-team` group get `ORG_MEMBER` role.

### Example 3: Multiple Mappings

**Scenario**: 
- Company domain users → Admin
- Sustainability team → Member
- Everyone else → Read-only

**Configuration:**
```
Priority: 10, Type: email_domain, Match: @acme.com, Role: ORG_ADMIN
Priority: 5, Type: group, Match: sustainability-team, Role: ORG_MEMBER
Priority: 0, Type: (default), Match: -, Role: READ_ONLY
```

---

## Troubleshooting

### OIDC Connection Test Fails

**Error: "Invalid issuer"**
- Verify issuer URL is correct
- Ensure it ends with `/realms/your-realm` (for Keycloak)
- Check that the issuer is accessible from OpenEco server

**Error: "Client authentication failed"**
- Verify Client ID matches your IdP configuration
- Verify Client Secret is correct (copy-paste, no extra spaces)
- Check that client is set to "confidential" in Keycloak

**Error: "Redirect URI mismatch"**
- Verify redirect URI in OpenEco matches IdP configuration
- Format: `https://climate.yourcompany.com/api/auth/oidc/callback?organizationId=*`
- The `*` wildcard allows any organization ID

### Users Can't Sign In

**User redirected back to sign-in page**
- Check OIDC is enabled in Admin → Authentication
- Verify role mappings are configured
- Check application logs for errors

**"Organization not found" error**
- Verify organization exists
- Check that user's email matches role mapping rules
- Ensure at least one role mapping exists

### Role Mapping Not Working

**User gets wrong role**
- Check role mapping priority (higher = checked first)
- Verify match value is correct (case-sensitive for groups)
- Check OIDC token includes expected claims (groups, email)

**User gets default role when they shouldn't**
- Verify email domain format (must start with `@`)
- Check group names match exactly (case-sensitive)
- Ensure role mappings are saved

---

## Security Best Practices

1. **Client Secrets**: Store encrypted in database (implemented in production)
2. **HTTPS Only**: Always use HTTPS in production
3. **Token Validation**: OpenEco validates issuer, audience, and signature
4. **Session Management**: Configurable session timeout
5. **Audit Logging**: All authentication events are logged
6. **Role Validation**: Only allowed roles can be assigned via mappings

---

## API Reference

### Authentication Endpoints

**Initiate OIDC Login:**
```
GET /api/auth/oidc/authorize?organizationId=xxx
```
Redirects user to identity provider.

**OIDC Callback:**
```
GET /api/auth/oidc/callback?code=xxx&state=xxx&organizationId=xxx
```
Handles OIDC callback and creates session.

**Admin Auth Config:**
```
GET /api/admin/auth-config?organizationId=xxx
POST /api/admin/auth-config
POST /api/admin/auth-config/test
```

**Role Mappings:**
```
GET /api/admin/role-mappings?authConfigId=xxx
POST /api/admin/role-mappings
```

---

## Related Documentation

- [INSTALLATION.md](./INSTALLATION.md) - Deployment guide
- [SECURITY_AND_GOVERNANCE.md](./SECURITY_AND_GOVERNANCE.md) - Security model
- [deploy/keycloak/README.md](./deploy/keycloak/README.md) - Keycloak deployment
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture

---

**Need help?** Open an issue on [GitHub](https://github.com/Open-Eco/oe-core/issues).
