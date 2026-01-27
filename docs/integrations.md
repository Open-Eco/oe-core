# Integrations

## Data Sources

CSV uploads, manual entry, APIs, and future AI-assisted input flows will all land in the same `RawActivityData` table.

## Infrastructure

OCI images compatible with Podman, Docker, containerd, and deployable on OKD/OpenShift or any Kubernetes cluster.

## Authentication

OpenEco uses **Keycloak as an open-source IdP bridge** that connects to your organization's existing identity provider (Azure AD, Okta, Google Workspace, etc.).

## Documentation

- [Authentication](./integrations/authentication.md) - Federated authentication setup (OIDC, Keycloak)
