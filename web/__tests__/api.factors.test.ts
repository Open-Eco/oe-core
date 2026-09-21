/**
 * @jest-environment node
 *
 * Tests for GET /api/factors and POST /api/factors
 */

// ── Mocks ────────────────────────────────────────────────────────────────────

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('../lib/auth', () => ({
  authOptions: {},
}));

jest.mock('../lib/prisma', () => ({
  prisma: {
    datasetVersion: { findMany: jest.fn() },
    emissionFactor: { findMany: jest.fn(), create: jest.fn() },
    organizationUser: { findFirst: jest.fn() },
    changeEvent: { create: jest.fn().mockResolvedValue({}) },
    auditLog: { create: jest.fn().mockResolvedValue({}) },
  },
}));

// ── Imports after mocks ──────────────────────────────────────────────────────

import { GET, POST } from '../app/api/factors/route';
import { getServerSession } from 'next-auth';
import { prisma } from '../lib/prisma';
import { NextRequest } from 'next/server';

const mockGetServerSession = getServerSession as jest.Mock;
const mockDatasetFindMany = prisma.datasetVersion.findMany as jest.Mock;
const mockFactorFindMany = prisma.emissionFactor.findMany as jest.Mock;
const mockFactorCreate = prisma.emissionFactor.create as jest.Mock;
const mockOrgUserFindFirst = prisma.organizationUser.findFirst as jest.Mock;

const SESSION = { user: { id: 'user-1', email: 'admin@example.com' } };

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeRequest(url: string, options?: RequestInit): NextRequest {
  return new NextRequest(url, options);
}

async function parseJson(response: Response) {
  const text = await response.text();
  return JSON.parse(text) as Record<string, unknown>;
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('GET /api/factors', () => {
  beforeEach(() => {
    mockGetServerSession.mockReset();
    mockDatasetFindMany.mockReset();
    mockFactorFindMany.mockReset();
  });

  it('returns 401 when not authenticated', async () => {
    mockGetServerSession.mockResolvedValue(null);
    const req = makeRequest('http://localhost:3000/api/factors');
    const response = await GET(req);
    expect(response.status).toBe(401);
  });

  it('returns datasets list when ?datasets=true', async () => {
    mockGetServerSession.mockResolvedValue(SESSION);
    const fakeDatasets = [
      { id: 'ds-1', name: 'DEFRA', version: '2024', _count: { emissionFactors: 10 } },
    ];
    mockDatasetFindMany.mockResolvedValue(fakeDatasets);

    const req = makeRequest('http://localhost:3000/api/factors?datasets=true');
    const response = await GET(req);
    const body = await parseJson(response);

    expect(response.status).toBe(200);
    expect(body.datasets).toEqual(fakeDatasets);
  });

  it('returns factors list filtered by datasetVersionId', async () => {
    mockGetServerSession.mockResolvedValue(SESSION);
    const fakeFactors = [
      {
        id: 'f-1',
        category: 'Electricity',
        activityType: 'grid',
        factor: 0.233,
        unit: 'kgCO2e/kWh',
        datasetVersion: { name: 'DEFRA', version: '2024' },
      },
    ];
    mockFactorFindMany.mockResolvedValue(fakeFactors);

    const req = makeRequest(
      'http://localhost:3000/api/factors?datasetVersionId=ds-1'
    );
    const response = await GET(req);
    const body = await parseJson(response);

    expect(response.status).toBe(200);
    expect(body.factors).toEqual(fakeFactors);
  });
});

describe('POST /api/factors', () => {
  beforeEach(() => {
    mockGetServerSession.mockReset();
    mockOrgUserFindFirst.mockReset();
    mockFactorCreate.mockReset();
  });

  it('returns 401 when not authenticated', async () => {
    mockGetServerSession.mockResolvedValue(null);
    const req = makeRequest('http://localhost:3000/api/factors', {
      method: 'POST',
      body: JSON.stringify({ type: 'factor' }),
    });
    const response = await POST(req);
    expect(response.status).toBe(401);
  });

  it('returns 403 when user is not an org admin', async () => {
    mockGetServerSession.mockResolvedValue(SESSION);
    mockOrgUserFindFirst.mockResolvedValue(null);

    const req = makeRequest('http://localhost:3000/api/factors', {
      method: 'POST',
      body: JSON.stringify({ type: 'factor' }),
    });
    const response = await POST(req);
    expect(response.status).toBe(403);
  });

  it('returns 400 for unknown type', async () => {
    mockGetServerSession.mockResolvedValue(SESSION);
    mockOrgUserFindFirst.mockResolvedValue({ role: 'ORG_ADMIN' });

    const req = makeRequest('http://localhost:3000/api/factors', {
      method: 'POST',
      body: JSON.stringify({ type: 'unknown' }),
    });
    const response = await POST(req);
    expect(response.status).toBe(400);
  });

  it('creates an emission factor successfully', async () => {
    mockGetServerSession.mockResolvedValue(SESSION);
    mockOrgUserFindFirst.mockResolvedValue({ role: 'ORG_ADMIN' });

    const newFactor = {
      id: 'f-new',
      datasetVersionId: 'ds-1',
      category: 'Electricity',
      activityType: 'grid',
      factor: 0.233,
      unit: 'kgCO2e/kWh',
      datasetVersion: { name: 'DEFRA', version: '2024' },
    };
    mockFactorCreate.mockResolvedValue(newFactor);

    const req = makeRequest('http://localhost:3000/api/factors', {
      method: 'POST',
      body: JSON.stringify({
        type: 'factor',
        datasetVersionId: 'ds-1',
        category: 'Electricity',
        activityType: 'grid',
        factor: 0.233,
        unit: 'kgCO2e/kWh',
      }),
    });
    const response = await POST(req);
    const body = await parseJson(response);

    expect(response.status).toBe(201);
    expect(body.factor).toEqual(newFactor);
  });
});
