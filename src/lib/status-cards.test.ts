import { describe, expect, it, vi } from 'vitest';
import { normalizeCards } from './status-cards';

const validCard = {
  id: 'card-1',
  title: '期中复习安排',
  content: '周三晚自习统一复习。',
  time: '2026-09-01T08:00:00.000Z',
  tags: ['公告'],
};

describe('normalizeCards', () => {
  it('passes through an array of valid cards unchanged', () => {
    const cards = normalizeCards([validCard]);
    expect(cards).toEqual([validCard]);
  });

  it('parses a JSON-string payload from the Upstash SDK', () => {
    const cards = normalizeCards(JSON.stringify([validCard]));
    expect(cards).toEqual([validCard]);
  });

  it('returns an empty array for non-array payloads', () => {
    expect(normalizeCards({ foo: 'bar' })).toEqual([]);
    expect(normalizeCards(null)).toEqual([]);
    expect(normalizeCards(undefined)).toEqual([]);
    expect(normalizeCards(42)).toEqual([]);
  });

  it('returns an empty array for malformed JSON strings', () => {
    expect(normalizeCards('{not json')).toEqual([]);
  });

  it('skips invalid cards and keeps the valid ones', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const cards = normalizeCards([
      { id: 'bad', title: '', content: 'x', time: validCard.time },
      null,
      'nope',
      validCard,
    ]);
    expect(cards).toEqual([validCard]);
    expect(warn).toHaveBeenCalledTimes(3);
    warn.mockRestore();
  });

  it('truncates id to 100 characters', () => {
    const cards = normalizeCards([{ ...validCard, id: 'a'.repeat(200) }]);
    expect(cards[0]?.id).toHaveLength(100);
  });

  it('truncates title to 120 characters', () => {
    const cards = normalizeCards([{ ...validCard, title: 't'.repeat(200) }]);
    expect(cards[0]?.title).toHaveLength(120);
  });

  it('truncates content to 5000 characters', () => {
    const cards = normalizeCards([{ ...validCard, content: 'c'.repeat(6000) }]);
    expect(cards[0]?.content).toHaveLength(5000);
  });

  it('truncates tags to 32 characters and dedupes them', () => {
    const cards = normalizeCards([
      {
        ...validCard,
        tags: ['x'.repeat(40), '测试', '测试', ' ', 'y'.repeat(40)],
      },
    ]);
    expect(cards[0]?.tags).toEqual(['x'.repeat(32), '测试', 'y'.repeat(32)]);
  });

  it('caps tags at 8 entries', () => {
    const cards = normalizeCards([
      { ...validCard, tags: Array.from({ length: 12 }, (_, i) => `tag${i}`) },
    ]);
    expect(cards[0]?.tags).toHaveLength(8);
    expect(cards[0]?.tags[7]).toBe('tag7');
  });

  it('caps the result at 100 cards', () => {
    const cards = normalizeCards(
      Array.from({ length: 120 }, (_, i) => ({
        ...validCard,
        id: `card-${i}`,
      }))
    );
    expect(cards).toHaveLength(100);
    expect(cards[99]?.id).toBe('card-99');
  });

  it('normalizes time values to ISO 8601', () => {
    const cards = normalizeCards([{ ...validCard, time: '2026-09-01 16:00 +08:00' }]);
    expect(cards[0]?.time).toBe('2026-09-01T08:00:00.000Z');
    expect(
      normalizeCards([{ ...validCard, time: 'not-a-date' }])
    ).toEqual([]);
  });
});
