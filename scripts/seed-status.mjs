// One-time seed script: write valid JSON to Upstash Redis status_cards key.
// Run: npx vercel env pull .env.local  (if needed)
//      node --env-file=.env.local scripts/seed-status.mjs
import { kv } from '@vercel/kv';

const cards = [
  {
    id: '1',
    title: '开学公告',
    content: '9月1日 8:00 报到\n带暑假作业、社会实践表',
    time: '2026-08-31T10:00:00.000Z',
    tags: ['通知', '开学'],
  },
];

// SDK auto JSON.stringify so quotes are preserved
await kv.set('status_cards', cards);

const verify = await kv.get('status_cards');
console.log('✅ status_cards written, verify:', JSON.stringify(verify, null, 2));
