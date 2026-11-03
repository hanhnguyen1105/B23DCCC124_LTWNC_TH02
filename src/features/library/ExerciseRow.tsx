import { memo } from 'react'
import type { Exercise } from '../../types'
import { formatDuration } from '../../utils/format'

export interface ExerciseRowProps {
  exercise: Exercise
  number: number
  isSaved: boolean
  onStart: (exercise: Exercise) => void
  onToggleSaved: (id: string) => void
  onAddToSession: (exercise: Exercise) => void
  onAddToRoutine: (exercise: Exercise) => void
}

function ExerciseRowComponent({
  exercise,
  number,
  isSaved,
  onStart,
  onToggleSaved,
  onAddToSession,
  onAddToRoutine,
}: ExerciseRowProps) {
  return (
    <div className="exercise-row" role="listitem">
      <span className="row-number">{number}</span>
      <span className="exercise-name" title={exercise.name}>{exercise.name}</span>
      <span className="exercise-trainer">{exercise.trainer}</span>
      <span className="group-pill">{exercise.group}</span>
      <span className="exercise-duration">{formatDuration(exercise.duration)}</span>
      <span className="row-actions">
        <button type="button" className="button button-primary" onClick={() => onStart(exercise)}>Bắt đầu</button>
        <button
          type="button"
          className={`icon-button${isSaved ? ' is-saved' : ''}`}
          aria-label={isSaved ? 'Bỏ lưu bài tập' : 'Lưu bài tập'}
          aria-pressed={isSaved}
          onClick={() => onToggleSaved(exercise.id)}
        >
          {isSaved ? '★' : '☆'}
        </button>
        <button type="button" className="button" onClick={() => onAddToSession(exercise)}>+ Buổi tập</button>
        <button type="button" className="button" onClick={() => onAddToRoutine(exercise)}>+ Giáo án</button>
      </span>
    </div>
  )
}

export const ExerciseRow = memo(ExerciseRowComponent)
