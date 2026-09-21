import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * GET /api/version
 *
 * Returns the running application version and optionally points to the
 * upstream release feed so self-hosted operators can check for updates
 * without centralising any data.
 *
 * Update check strategy (pull-based, no telemetry):
 *   Operators can poll this endpoint on their instance to confirm the
 *   running version, and separately poll the GitHub Releases API:
 *     https://api.github.com/repos/Open-Eco/oe-core/releases/latest
 *   If tag_name > version, a new image is available.
 */
export async function GET() {
  let version = 'unknown';
  try {
    const pkg = JSON.parse(
      readFileSync(join(process.cwd(), 'package.json'), 'utf8')
    ) as { version?: string };
    version = pkg.version ?? 'unknown';
  } catch {
    // package.json may not be present in all deployment targets; non-fatal.
  }

  return NextResponse.json({
    version,
    releasesFeedUrl:
      'https://api.github.com/repos/Open-Eco/oe-core/releases/latest',
  });
}
