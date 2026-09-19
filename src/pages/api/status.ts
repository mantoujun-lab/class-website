// GET /api/status - read all status cards from Upstash Redis.
// Other CRUD operations are intentionally omitted; update via the Upstash dashboard.
import { Redis } from '@upstash/redis';
import type { APIRoute } from 'astro';

export const prerender = false;

const redis = Redis.fromEnv();

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
};

const MAX_STATUS_CARDS = 100;
const MAX_ID_LENGTH = 100;
const MAX_TITLE_LENGTH = 120;
const MAX_CONTENT_LENGTH = 5000;
const MAX_TAG_LENGTH = 32;
const MAX_TAGS = 8;

interface StatusCard {
  id: string;
  title: string;
  content: string;
  time: string;
  tags: string[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeRequiredText(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') return null;

  const normalized = value.trim();
  if (!normalized) return null;

  return normalized.slice(0, maxLength);
}

function normalizeTags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  const tags = new Set<string>();
  for (const item of value) {
    const tag = normalizeRequiredText(item, MAX_TAG_LENGTH);
    if (!tag) continue;

    tags.add(tag);
    if (tags.size === MAX_TAGS) break;
  }

  return [...tags];
}

function normalizeTime(value: unknown): string | null {
  if (typeof value !== 'string') return null;

  const timestamp = Date.parse(value.trim());
  if (Number.isNaN(timestamp)) return null;

  return new Date(timestamp).toISOString();
}

function normalizeStatusCard(value: unknown): StatusCard | null {
  if (!isRecord(value)) return null;

  const id = normalizeRequiredText(value.id, MAX_ID_LENGTH);
  const title = normalizeRequiredText(value.title, MAX_TITLE_LENGTH);
  const content = normalizeRequiredText(value.content, MAX_CONTENT_LENGTH);
  const time = normalizeTime(value.time);

  if (!id || !title || !content || !time) return null;

  return {
    id,
    title,
    content,
    time,
    tags: normalizeTags(value.tags),
  };
}

// Normalize KV reads and validate every card before exposing it to clients.
function normalizeCards(raw: unknown): StatusCard[] {
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map(normalizeStatusCard)
      .filter((card): card is StatusCard => card !== null)
      .slice(0, MAX_STATUS_CARDS);
  } catch {
    return [];
  }
}

export const GET: APIRoute = async () => {
  try {
    const raw = await redis.get<unknown>('status_cards');
    const cards = normalizeCards(raw);
    return new Response(JSON.stringify(cards), {
      status: 200,
      headers: JSON_HEADERS,
    });
  } catch (err) {
    console.error('Failed to fetch status cards', err);
    return new Response(
      JSON.stringify({ ok: false, error: 'Internal server error' }),
      { status: 500, headers: JSON_HEADERS }
    );
  }
};
