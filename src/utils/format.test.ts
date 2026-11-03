import { describe, expect, it } from 'vitest'
import { formatDuration } from './format'

describe('formatDuration', () => {
  it('hiển thị 0 giây thành 0:00', () => {
    expect(formatDuration(0)).toBe('0:00')
  })

  it('thêm số 0 trước số giây nhỏ hơn 10', () => {
    expect(formatDuration(67)).toBe('1:07')
  })

  it('hiển thị đúng số phút tròn', () => {
    expect(formatDuration(120)).toBe('2:00')
  })
})
