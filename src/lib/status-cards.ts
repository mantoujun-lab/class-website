// 状态卡片的纯校验与归一化逻辑，从 /api/status 抽出以便单元测试
// （src/lib/status-cards.test.ts）。保持行为不变：兼容 Upstash SDK
// 返回的数组或 JSON 字符串两种形态，逐张校验字段类型与长度上限，
// 非法卡片跳过，数量超限截断。

export interface StatusCard {
  id: string;
  title: string;
  content: string;
  time: string;
  tags: string[];
}

const MAX_STATUS_CARDS = 100;
const MAX_ID_LENGTH = 100;
const MAX_TITLE_LENGTH = 120;
const MAX_CONTENT_LENGTH = 5000;
const MAX_TAG_LENGTH = 32;
const MAX_TAGS = 8;

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
export function normalizeCards(raw: unknown): StatusCard[] {
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((value, index) => {
        const card = normalizeStatusCard(value);
        if (!card) {
          const label =
            isRecord(value) && value.id != null
              ? `id=${String(value.id)}`
              : `index=${index}`;
          console.warn(`Skipping invalid status card (${label})`);
        }
        return card;
      })
      .filter((card): card is StatusCard => card !== null)
      .slice(0, MAX_STATUS_CARDS);
  } catch {
    return [];
  }
}
