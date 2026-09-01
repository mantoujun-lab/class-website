// GET /api/status - read all status cards from Vercel KV.
// Other CRUD operations are intentionally omitted; update via Vercel Dashboard.
import { kv } from '@vercel/kv';
import type { APIRoute } from 'astro';

export const prerender = false;

interface StatusCard {
  id: string;
  title: string;
  content: string;
  time: string;
  tags: string[];
}

export const GET: APIRoute = async () => {
  try {
    const cards = (await kv.get<StatusCard[]>('status_cards')) ?? [];
    return new Response(JSON.stringify(cards), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: String(err) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
