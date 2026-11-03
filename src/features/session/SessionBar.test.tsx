import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { generateExercises } from '../../data/exercises'
import { SessionBar } from './SessionBar'
import { useSessionStore } from './useSessionStore'

describe('SessionBar', () => {
  beforeEach(() => {
    useSessionStore.setState({ queue: [], currentIndex: -1, isRunning: false, elapsed: 0 })
  })

  it('hiển thị trạng thái chưa bắt đầu và vô hiệu hóa điều khiển', () => {
    render(<SessionBar />)
    expect(screen.getByText('Chưa bắt đầu buổi tập')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Bắt đầu' })).toBeDisabled()
  })

  it('hiển thị bài hiện tại và điều khiển chạy, lùi, tiến', () => {
    const exercises = generateExercises(2)
    useSessionStore.getState().startSession(exercises, 0)
    render(<SessionBar />)
    expect(screen.getByText('Đang tập: Đẩy tạ đơn 1')).toBeInTheDocument()
    expect(screen.getByText('Còn lại')).toBeInTheDocument()
    expect(screen.getByText('0:30')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
    fireEvent.click(screen.getByRole('button', { name: 'Tạm dừng' }))
    expect(useSessionStore.getState().isRunning).toBe(false)
    fireEvent.click(screen.getByRole('button', { name: 'Sau' }))
    expect(useSessionStore.getState().currentIndex).toBe(1)
    fireEvent.click(screen.getByRole('button', { name: 'Trước' }))
    expect(useSessionStore.getState().currentIndex).toBe(0)
  })
})
