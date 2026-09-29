// normalizeCards() 的单元测试：覆盖 Upstash SDK 的数组与 JSON 字符串
// 双形态、非法卡片跳过、字段截断、标签去重与数量上限。
import { describe, expect, it } from 'vitest';
import { normalizeCards } from './status-cards';

function makeCard(overrides: Record<string, unknown> = {}) {
  return {
    id: '1',
    title: '开学公告',
    content: '9月1日 8:00 报到',
    time: '2026-08-31T10:00:00.000Z',
    tags: ['通知'],
    ...overrides,
  };
}

describe('normalizeCards', () => {
  it('接受数组形态并原样返回合法卡片', () => {
    const cards = [makeCard(), makeCard({ id: '2' })];
    expect(normalizeCards(cards)).toEqual(cards);
  });

  it('接受 JSON 字符串形态（Upstash SDK 的另一种返回）', () => {
    const cards = [makeCard()];
    expect(normalizeCards(JSON.stringify(cards))).toEqual(cards);
  });

  it('非数组输入返回空数组', () => {
    expect(normalizeCards(null)).toEqual([]);
    expect(normalizeCards(undefined)).toEqual([]);
    expect(normalizeCards({ 0: makeCard() })).toEqual([]);
  });

  it('JSON 字符串解析结果不是数组时返回空数组', () => {
    expect(normalizeCards(JSON.stringify({ ok: true }))).toEqual([]);
  });

  it('非法 JSON 字符串返回空数组', () => {
    expect(normalizeCards('[{broken')).toEqual([]);
  });

  it('跳过字段缺失或类型错误的卡片', () => {
    const raw = [
      makeCard(),
      makeCard({ id: 123 }),
      makeCard({ title: '   ' }),
      makeCard({ content: null }),
      makeCard({ time: 'not-a-date' }),
      'not-a-card',
    ];
    expect(normalizeCards(raw)).toEqual([makeCard()]);
  });

  it('时间归一化为 ISO 8601 UTC 格式', () => {
    const raw = [makeCard({ time: '2026-08-31T18:00:00+08:00' })];
    expect(normalizeCards(raw)).toEqual([makeCard({ time: '2026-08-31T10:00:00.000Z' })]);
  });

  it('字段超长时截断到上限（id 100 / title 120 / content 5000）', () => {
    const raw = [
      makeCard({
        id: 'i'.repeat(101),
        title: 't'.repeat(121),
        content: 'c'.repeat(5001),
      }),
    ];
    const [card] = normalizeCards(raw);
    expect(card.id).toHaveLength(100);
    expect(card.title).toHaveLength(120);
    expect(card.content).toHaveLength(5000);
  });

  it('tags 去重、跳过非法项、上限 8 个', () => {
    const tags = ['a', 'a', 123, '   ', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
    const [card] = normalizeCards([makeCard({ tags })]);
    expect(card.tags).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']);
  });

  it('单个标签超过 32 字符时截断', () => {
    const [card] = normalizeCards([makeCard({ tags: ['t'.repeat(33)] })]);
    expect(card.tags).toEqual(['t'.repeat(32)]);
  });

  it('tags 非数组时返回空标签', () => {
    const [card] = normalizeCards([makeCard({ tags: '通知' })]);
    expect(card.tags).toEqual([]);
  });

  it('卡片数量超过 100 时截断', () => {
    const raw = Array.from({ length: 150 }, (_, i) => makeCard({ id: String(i) }));
    const cards = normalizeCards(raw);
    expect(cards).toHaveLength(100);
    expect(cards[99].id).toBe('99');
  });
});
