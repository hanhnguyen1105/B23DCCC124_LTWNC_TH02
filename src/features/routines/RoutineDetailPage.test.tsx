import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useSessionStore } from '../session/useSessionStore'
import { RoutineProvider } from './RoutineContext'
import RoutineDetailPage from './RoutineDetailPage'

function renderDetail(id = 'r1') {
  return render(
    <MemoryRouter initialEntries={[`/routines/${id}`]}>
      <RoutineProvider>
        <Routes>
          <Route path="/routines/:id" element={<RoutineDetailPage />} />
        </Routes>
      </RoutineProvider>
    </MemoryRouter>,
  )
}

describe('RoutineDetailPage', () => {
  beforeEach(() => {
    window.localStorage.clear()
    useSessionStore.setState({ queue: [], currentIndex: -1, isRunning: false, elapsed: 0 })
    vi.spyOn(console, 'log').mockImplementation(() => undefined)
    window.localStorage.setItem('workout-routines', JSON.stringify([
      { id: 'r1', name: 'Ngày ngực', exerciseIds: ['e1', 'e2'] },
    ]))
  })

  it('hiển thị bài tập và tổng thời gian của giáo án', () => {
    renderDetail()
    expect(screen.getByRole('heading', { name: 'Ngày ngực' })).toBeInTheDocument()
    expect(screen.getByText('Tổng thời gian: 1 phút 37 giây')).toBeInTheDocument()
  })

  it('bắt đầu buổi tập với các bài trong giáo án', () => {
    renderDetail()
    fireEvent.click(screen.getByRole('button', { name: 'Tập tất cả' }))
    expect(useSessionStore.getState().queue.map((exercise) => exercise.id)).toEqual(['e1', 'e2'])
    expect(useSessionStore.getState().isRunning).toBe(true)
  })

  it('bỏ bài khỏi giáo án', () => {
    renderDetail()
    fireEvent.click(screen.getAllByRole('button', { name: 'Bỏ' })[0])
    expect(window.localStorage.getItem('workout-routines')).toContain('"e2"')
  })

  it('thông báo khi không tìm thấy giáo án', () => {
    renderDetail('missing')
    expect(screen.getByText(/Không tìm thấy giáo án/)).toBeInTheDocument()
  })
})
