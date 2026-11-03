import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { useSessionStore } from '../session/useSessionStore'
import SavedPage from './SavedPage'
import { useSavedStore } from './useSavedStore'

describe('SavedPage', () => {
  beforeEach(() => {
    window.localStorage.clear()
    useSavedStore.setState({ ids: [] })
    useSessionStore.setState({ queue: [], currentIndex: -1, isRunning: false, elapsed: 0 })
  })

  it('thông báo khi chưa có bài tập đã lưu', () => {
    render(<MemoryRouter><SavedPage /></MemoryRouter>)
    expect(screen.getByText('Bạn chưa lưu bài tập nào')).toBeInTheDocument()
  })

  it('hiển thị bài đã lưu và bắt đầu được bài tập', () => {
    useSavedStore.setState({ ids: ['e1', 'e3'] })
    render(<MemoryRouter><SavedPage /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: 'Bài tập đã lưu' })).toBeInTheDocument()
    expect(screen.getByText('Đẩy tạ đơn 1')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Tập tất cả · 2' }))
    expect(useSessionStore.getState().queue.map((exercise) => exercise.id)).toEqual(['e1', 'e3'])
  })

  it('bỏ lưu bài tập khỏi danh sách', () => {
    useSavedStore.setState({ ids: ['e1'] })
    render(<MemoryRouter><SavedPage /></MemoryRouter>)
    fireEvent.click(screen.getByRole('button', { name: 'Bỏ lưu' }))
    expect(useSavedStore.getState().ids).toEqual([])
  })
})
