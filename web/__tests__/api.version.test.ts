/**
 * @jest-environment node
 *
 * Tests for GET /api/version
 */

import { GET } from '../app/api/version/route';

async function parseJson(response: Response) {
  const text = await response.text();
  return JSON.parse(text) as Record<string, unknown>;
}

describe('GET /api/version', () => {
  it('returns a version string and a releasesFeedUrl', async () => {
    const response = await GET();
    const body = await parseJson(response);

    expect(response.status).toBe(200);
    expect(typeof body.version).toBe('string');
    expect(typeof body.releasesFeedUrl).toBe('string');
    expect(body.releasesFeedUrl).toMatch(/Open-Eco\/oe-core/);
  });

  it('version is non-empty', async () => {
    const response = await GET();
    const body = await parseJson(response);
    expect((body.version as string).length).toBeGreaterThan(0);
  });
});
