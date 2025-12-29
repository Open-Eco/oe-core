# Keycloak Deployment for OpenEco

This directory contains deployment templates for Keycloak, an open-source identity provider that works with OpenEco's federated authentication.

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

### 1. Configure Keycloak

1. **Access Admin Console**
   - Navigate to `https://keycloak.yourcompany.com`
   - Sign in with admin credentials

2. **Create Realm**
   - Click "Create Realm"
   - Name: `your-company` (or your organization name)
   - Click "Create"

3. **Create Client for OpenEco**
   - Go to "Clients" → "Create client"
   - Client ID: `openeco`
   - Client protocol: `openid-connect`
   - Click "Next"
   - Access Type: `confidential`
   - Valid Redirect URIs: `https://climate.yourcompany.com/api/auth/callback/oidc?organizationId=*`
   - Web Origins: `https://climate.yourcompany.com`
   - Click "Save"
   - Go to "Credentials" tab
   - Copy the "Secret" value (you'll need this for OpenEco config)

4. **Configure User Groups (Optional)**
   - Go to "Groups" → "Create group"
   - Create groups like: `sustainability-team`, `admins`, etc.
   - Assign users to groups
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
