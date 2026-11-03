import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { RoutineProvider } from './RoutineContext'
import RoutinesPage from './RoutinesPage'

function renderWithProviders() {
  return render(
    <MemoryRouter>
      <RoutineProvider>
        <RoutinesPage />
      </RoutineProvider>
    </MemoryRouter>,
  )
}

describe('RoutinesPage', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.spyOn(console, 'log').mockImplementation(() => undefined)
  })

  it('báo lỗi khi tạo giáo án với tên trống', () => {
    renderWithProviders()
    fireEvent.click(screen.getByRole('button', { name: '+ Tạo giáo án' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Tên giáo án không được để trống')
  })

  it('thêm giáo án mới vào danh sách', () => {
    renderWithProviders()
    fireEvent.change(screen.getByLabelText('Tên giáo án'), { target: { value: 'Ngày ngực' } })
    fireEvent.click(screen.getByRole('button', { name: '+ Tạo giáo án' }))
    expect(screen.getByRole('heading', { name: 'Ngày ngực' })).toBeInTheDocument()
  })

  it('không cho phép tạo giáo án trùng tên, không phân biệt hoa thường', () => {
    renderWithProviders()
    fireEvent.change(screen.getByLabelText('Tên giáo án'), { target: { value: 'Ngày ngực' } })
    fireEvent.click(screen.getByRole('button', { name: '+ Tạo giáo án' }))
    fireEvent.change(screen.getByLabelText('Tên giáo án'), { target: { value: 'ngày NGỰC' } })
    fireEvent.click(screen.getByRole('button', { name: '+ Tạo giáo án' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Tên giáo án đã tồn tại')
    expect(screen.getAllByRole('heading', { name: /Ngày ngực/i })).toHaveLength(1)
  })
})
