/**
 * @jest-environment node
 *
 * Tests for GET /api/health
 * The health route queries the database with `prisma.$queryRaw`.
 */

// ── Mocks ────────────────────────────────────────────────────────────────────

jest.mock('../lib/prisma', () => ({
  prisma: {
    $queryRaw: jest.fn(),
  },
}));

// ── Import after mocks ───────────────────────────────────────────────────────

import { GET } from '../app/api/health/route';
import { prisma } from '../lib/prisma';

const mockQueryRaw = prisma.$queryRaw as jest.Mock;

// ── Helpers ──────────────────────────────────────────────────────────────────

async function parseJson(response: Response) {
  const text = await response.text();
  return JSON.parse(text) as Record<string, unknown>;
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('GET /api/health', () => {
  beforeEach(() => {
    mockQueryRaw.mockReset();
  });

  it('returns 200 with status=healthy when DB is reachable', async () => {
    mockQueryRaw.mockResolvedValue([{ '?column?': 1 }]);

    const response = await GET();
    const body = await parseJson(response);

    expect(response.status).toBe(200);
    expect(body.status).toBe('healthy');
    expect((body.checks as Record<string, string>).database).toBe('ok');
    expect((body.checks as Record<string, string>).app).toBe('ok');
    expect(typeof body.timestamp).toBe('string');
  });

  it('returns 503 with status=unhealthy when DB is unreachable', async () => {
    mockQueryRaw.mockRejectedValue(new Error('Connection refused'));

    const response = await GET();
    const body = await parseJson(response);

    expect(response.status).toBe(503);
    expect(body.status).toBe('unhealthy');
    expect((body.checks as Record<string, string>).database).toBe('error');
    expect((body.checks as Record<string, string>).app).toBe('ok');
  });
});
