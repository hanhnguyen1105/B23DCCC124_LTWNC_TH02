import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { generateExercises } from '../../data/exercises'
import { ExerciseRow } from './ExerciseRow'

describe('ExerciseRow', () => {
  it('hiển thị bài tập và gọi callback bắt đầu với đúng bài', () => {
    const exercise = generateExercises(1)[0]
    const onStart = vi.fn()
    render(
      <ExerciseRow
        exercise={exercise}
        number={1}
        isSaved={false}
        onStart={onStart}
        onToggleSaved={vi.fn()}
        onAddToSession={vi.fn()}
        onAddToRoutine={vi.fn()}
      />,
    )
    expect(screen.getByText('Đẩy tạ đơn 1')).toBeInTheDocument()
    expect(screen.getByText('0:30')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Bắt đầu' }))
    expect(onStart).toHaveBeenCalledWith(exercise)
  })

  it('đổi nút lưu sang bỏ lưu khi bài đã được lưu', () => {
    const exercise = generateExercises(1)[0]
    render(
      <ExerciseRow
        exercise={exercise}
        number={1}
        isSaved
        onStart={vi.fn()}
        onToggleSaved={vi.fn()}
        onAddToSession={vi.fn()}
        onAddToRoutine={vi.fn()}
      />,
    )
    expect(screen.getByRole('button', { name: 'Bỏ lưu bài tập' })).toHaveAttribute('aria-pressed', 'true')
  })
})
