# Keycloak Deployment for OpenEco

This directory contains deployment templates for **Keycloak**, an open-source **IdP bridge** that works with OpenEco's federated authentication.

## Keycloak as IdP Bridge

Keycloak acts as an **identity provider bridge** that:
- ✅ Supports **OIDC + SAML** protocols
- ✅ Connects to your organization's existing IdP (Azure AD, Okta, Google Workspace, Active Directory, etc.)
- ✅ Presents a single OIDC endpoint to OpenEco
- ✅ **Industry-standard**: Used by Red Hat, governments, NGOs
- ✅ **Actively maintained** with regular security updates
- ✅ **Zero license cost** (fully open-source)
- ✅ **Flexible deployment**: Can run embedded, as sidecar, or externally

### Architecture Pattern

**Critical Point:** You host one Keycloak instance, but each organization brings their own IdP.

```
User → OpenEco → Keycloak (IdP Bridge) → Organization's IdP (Azure AD/Okta/etc.)
                                      ↓
                                  User authenticates
                                      ↓
                                  Keycloak issues OIDC token to OpenEco
```

Each organization connects their existing IdP to Keycloak, and Keycloak federates all of them to OpenEco.

## Quick Start

### Docker Compose (Development)

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

# Or with Podman
podman-compose up -d
```

Access Keycloak Admin Console: `http://localhost:8080` (or your configured hostname)

Default credentials:
- Username: `admin` (or your `KEYCLOAK_ADMIN`)
- Password: `change-me` (or your `KEYCLOAK_ADMIN_PASSWORD`)

## Production Setup

### 1. Configure Keycloak as IdP Bridge

1. **Access Admin Console**
   - Navigate to `https://keycloak.yourcompany.com`
   - Sign in with admin credentials

2. **Create Realm**
   - Click "Create Realm"
   - Name: `your-company` (or your organization name)
   - Click "Create"

3. **Connect Your Organization's IdP (Identity Provider)**

   This is the **critical step** - connect your existing IdP to Keycloak:

   **For Azure AD:**
   - Go to "Identity Providers" → "Add provider" → "OpenID Connect v1.0"
   - Alias: `azure-ad`
   - Discovery Endpoint: `https://login.microsoftonline.com/{tenant-id}/.well-known/openid-configuration`
   - Client ID: `[from Azure AD App Registration]`
   - Client Secret: `[from Azure AD App Registration]`
   - Click "Save"

   **For Okta:**
   - Go to "Identity Providers" → "Add provider" → "OpenID Connect v1.0"
   - Alias: `okta`
   - Discovery Endpoint: `https://{your-domain}.okta.com/.well-known/openid-configuration`
   - Client ID: `[from Okta Application]`
   - Client Secret: `[from Okta Application]`
   - Click "Save"

   **For Google Workspace:**
   - Go to "Identity Providers" → "Add provider" → "Google"
   - Client ID: `[from Google Cloud Console]`
   - Client Secret: `[from Google Cloud Console]`
   - Click "Save"

   **For Active Directory (LDAP):**
   - Go to "User Federation" → "Add provider" → "ldap"
   - Configure LDAP connection details (server, bind DN, etc.)
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

### 2. Configure OpenEco

1. **Access OpenEco Admin Panel**
   - Sign in to OpenEco
   - Go to Admin → Authentication

2. **Enter OIDC Configuration**
   - Issuer: `https://keycloak.yourcompany.com/realms/your-company`
   - Client ID: `openeco`
   - Client Secret: `[paste from Keycloak]`
   - Audience: `openeco` (if required)

3. **Configure Role Mappings**
   - Email Domain: `@yourcompany.com` → `ORG_ADMIN`
   - Group: `sustainability-team` → `ORG_MEMBER`
   - etc.

4. **Test Connection**
   - Click "Test Connection"
   - If successful, enable OIDC authentication

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `KEYCLOAK_ADMIN` | Admin username | `admin` |
| `KEYCLOAK_ADMIN_PASSWORD` | Admin password | `change-me` |
| `KEYCLOAK_DB_PASSWORD` | Database password | `change-me` |
| `KEYCLOAK_HOSTNAME` | Keycloak hostname | `localhost` |
| `KEYCLOAK_PORT` | Keycloak port | `8080` |

## Production Considerations

1. **Use HTTPS**: Configure reverse proxy (NGINX/Traefik) with SSL
2. **Strong Passwords**: Change all default passwords
3. **Database Backups**: Set up automated backups for Keycloak database
4. **High Availability**: Use Keycloak in cluster mode for production
5. **Resource Limits**: Allocate sufficient CPU/memory (4GB+ RAM recommended)

## Integration with OpenEco

See [AUTHENTICATION.md](../../AUTHENTICATION.md) for detailed integration instructions.

## Troubleshooting

**Keycloak won't start:**
- Check database connectivity
- Verify environment variables
- Check logs: `docker logs openeco-keycloak`

**Can't access admin console:**
- Verify `KEYCLOAK_HOSTNAME` matches your access URL
- Check firewall rules
- Ensure port is exposed

**OIDC connection fails:**
- Verify issuer URL is correct
- Check client secret matches
- Ensure redirect URI is configured correctly in Keycloak
