// GET /api/status - read all status cards from Upstash Redis.
// Other CRUD operations are intentionally omitted; update via the Upstash dashboard.
import { Redis } from '@upstash/redis';
import { normalizeCards } from '../../lib/status-cards';
import type { APIRoute } from 'astro';

export const prerender = false;

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
};

function createRedis(): Redis {
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    throw new Error(
      'Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN environment variables. Configure them locally in .env.local (see README).'
    );
  }
  return Redis.fromEnv();
}

export const GET: APIRoute = async () => {
  try {
    const redis = createRedis();
    const raw = await redis.get<unknown>('status_cards');
    const cards = normalizeCards(raw);
    return new Response(JSON.stringify(cards), {
      status: 200,
      headers: JSON_HEADERS,
    });
  } catch (err) {
    console.error('Failed to fetch status cards', err);
    return new Response(
      JSON.stringify({
        ok: false,
        error:
          err instanceof Error && err.message.startsWith('Missing UPSTASH')
            ? err.message
            : 'Internal server error',
      }),
      { status: 500, headers: JSON_HEADERS }
    );
  }
};
