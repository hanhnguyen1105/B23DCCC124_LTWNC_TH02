import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useDebounce } from './useDebounce'

describe('useDebounce', () => {
  afterEach(() => vi.useRealTimers())

  it('chỉ cập nhật giá trị sau khi hết thời gian chờ', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), { initialProps: { value: 'đẩy' } })
    rerender({ value: 'kéo' })
    expect(result.current).toBe('đẩy')
    act(() => vi.advanceTimersByTime(299))
    expect(result.current).toBe('đẩy')
    act(() => vi.advanceTimersByTime(1))
    expect(result.current).toBe('kéo')
  })
})
