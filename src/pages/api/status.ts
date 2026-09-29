// GET /api/status - read all status cards from Upstash Redis.
// Other CRUD operations are intentionally omitted; update via the Upstash dashboard.
import { Redis } from '@upstash/redis';
import type { APIRoute } from 'astro';
import { normalizeCards } from '../../lib/status-cards';

export const prerender = false;

// 懒初始化：不在模块加载阶段创建客户端，环境变量缺失时在请求阶段
// 返回明确的配置错误，而不是无提示的 500（本地未配置 .env.local 时
// 更友好；Vercel 上已配置变量，不受影响）。注意 SDK 还接受 KV_REST_API_*
// 回退命名，但本项目只用文档中的 UPSTASH_* 变量，这里也只检查它们。
let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (redis) return redis;
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  redis = Redis.fromEnv();
  return redis;
}

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
};

const NOT_CONFIGURED_ERROR =
  'Upstash Redis is not configured: set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN';

export const GET: APIRoute = async () => {
  const client = getRedis();
  if (!client) {
    return new Response(
      JSON.stringify({ ok: false, error: NOT_CONFIGURED_ERROR }),
      { status: 500, headers: JSON_HEADERS }
    );
  }
  try {
    const raw = await client.get<unknown>('status_cards');
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
