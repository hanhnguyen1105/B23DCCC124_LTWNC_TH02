import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { RoutineProvider } from '../routines/RoutineContext'
import { useSavedStore } from '../saved/useSavedStore'
import { useSessionStore } from '../session/useSessionStore'
import { LibraryPage } from './LibraryPage'

function renderWithProviders() {
  return render(
    <MemoryRouter>
      <RoutineProvider>
        <LibraryPage />
      </RoutineProvider>
    </MemoryRouter>,
  )
}

describe('LibraryPage', () => {
  beforeEach(() => {
    window.localStorage.clear()
    useSavedStore.setState({ ids: [] })
    useSessionStore.setState({ queue: [], currentIndex: -1, isRunning: false, elapsed: 0 })
    vi.spyOn(console, 'log').mockImplementation(() => undefined)
  })

  it('hiển thị tổng số bài và chỉ tạo các dòng đang nhìn thấy', () => {
    renderWithProviders()
    expect(screen.getByText('Tìm thấy 10000 bài tập')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem').length).toBeLessThan(20)
    expect(screen.getByText('Đẩy tạ đơn 1')).toBeInTheDocument()
  })

  it('lọc sau debounce, lọc theo nhóm cơ và sắp xếp tên', async () => {
    renderWithProviders()
    fireEvent.change(screen.getByRole('searchbox', { name: 'Tìm kiếm' }), { target: { value: 'đẩy' } })
    expect(screen.getByText('Tìm thấy 10000 bài tập')).toBeInTheDocument()
    await waitFor(() => expect(screen.getByText('Tìm thấy 1250 bài tập')).toBeInTheDocument())
    fireEvent.change(screen.getByLabelText('Nhóm cơ'), { target: { value: 'Vai' } })
    await waitFor(() => expect(screen.getByText('Tìm thấy 250 bài tập')).toBeInTheDocument())
    fireEvent.change(screen.getByRole('searchbox', { name: 'Tìm kiếm' }), { target: { value: '' } })
    await waitFor(() => expect(screen.getByText('Tìm thấy 2000 bài tập')).toBeInTheDocument())
    fireEvent.change(screen.getByLabelText('Sắp xếp'), { target: { value: 'name' } })
    expect(screen.getByText('Bật chậm 1')).toBeInTheDocument()
  })

  it('hiển thị trạng thái rỗng khi không có kết quả', async () => {
    renderWithProviders()
    fireEvent.change(screen.getByRole('searchbox', { name: 'Tìm kiếm' }), { target: { value: 'xyz' } })
    await waitFor(() => expect(screen.getByText('Không tìm thấy bài tập nào')).toBeInTheDocument())
  })

  it('bắt đầu, lưu và thêm bài tập vào buổi tập', () => {
    renderWithProviders()
    fireEvent.click(screen.getAllByRole('button', { name: 'Bắt đầu' })[0])
    expect(useSessionStore.getState().currentIndex).toBe(0)
    expect(useSessionStore.getState().queue).toHaveLength(10000)
    expect(useSessionStore.getState().queue[0].id).toBe('e1')
    fireEvent.click(screen.getAllByRole('button', { name: 'Lưu bài tập' })[0])
    expect(useSavedStore.getState().ids).toEqual(['e1'])
    fireEvent.click(screen.getAllByRole('button', { name: '+ Buổi tập' })[1])
    expect(useSessionStore.getState().queue.map((exercise) => exercise.id)).toEqual(['e1', 'e2'])
  })

  it('thêm bài tập vào giáo án đang chọn', () => {
    window.localStorage.setItem('workout-routines', JSON.stringify([{ id: 'r1', name: 'Ngày ngực', exerciseIds: [] }]))
    renderWithProviders()
    fireEvent.change(screen.getByLabelText('Giáo án đang chọn'), { target: { value: 'r1' } })
    fireEvent.click(screen.getAllByRole('button', { name: '+ Giáo án' })[0])
    expect(window.localStorage.getItem('workout-routines')).toContain('"e1"')
    expect(screen.getByRole('status')).toHaveTextContent('Đã thêm')
  })
})
