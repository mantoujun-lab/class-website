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

export const GET: APIRoute = async () => {
  try {
    const cards = (await redis.get<StatusCard[]>('status_cards')) ?? [];
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
