// GET /api/status - read all status cards from Upstash Redis.
// Other CRUD operations are intentionally omitted; update via the Upstash dashboard.
import { Redis } from '@upstash/redis';
import type { APIRoute } from 'astro';

export const prerender = false;

const redis = Redis.fromEnv();

interface StatusCard {
  id: string;
  title: string;
  content: string;
  time: string;
  tags: string[];
}

// Normalize KV read result: Upstash SDK returns raw string when JSON.parse fails.
function normalizeCards(raw: unknown): StatusCard[] {
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

export const GET: APIRoute = async () => {
  try {
    const raw = await redis.get<StatusCard[]>('status_cards');
    const cards = normalizeCards(raw);
    return new Response(JSON.stringify(cards), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Failed to fetch status cards', err);
    return new Response(
      JSON.stringify({ ok: false, error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
