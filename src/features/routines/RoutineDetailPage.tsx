import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { EXERCISES } from '../../data/exercises'
import { useSessionStore } from '../session/useSessionStore'
import { useRoutineDispatch, useRoutines } from './RoutineContext'

export default function RoutineDetailPage() {
  const { id } = useParams()
  const routines = useRoutines()
  const dispatch = useRoutineDispatch()
  const startSession = useSessionStore((state) => state.startSession)
  const routine = routines.find((item) => item.id === id)
  const exercises = useMemo(() => {
    if (!routine) return []
    const exerciseIds = new Set(routine.exerciseIds)
    return EXERCISES.filter((exercise) => exerciseIds.has(exercise.id))
  }, [routine])

  if (!routine) {
    return <div className="panel empty-state">Không tìm thấy giáo án. <Link className="text-link" to="/routines">Quay lại danh sách</Link></div>
  }

  const totalSeconds = exercises.reduce((total, exercise) => total + exercise.duration, 0)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return (
    <section>
      <div className="page-heading">
        <div>
          <Link className="text-link" to="/routines">← Tất cả giáo án</Link>
          <p className="eyebrow" style={{ marginTop: 16 }}>GIÁO ÁN TÙY CHỈNH</p>
          <h1>{routine.name}</h1>
          <p>{exercises.length} bài tập được sắp xếp theo nhịp của bạn.</p>
        </div>
      </div>
      <div className="detail-card">
        {exercises.length === 0 ? (
          <p className="empty-state">Giáo án chưa có bài tập nào. Thêm bài từ Kho bài tập nhé.</p>
        ) : (
          <ul className="detail-list">
            {exercises.map((exercise, index) => (
              <li className="detail-row" key={exercise.id}>
                <div>
                  <strong>{String(index + 1).padStart(2, '0')} · {exercise.name}</strong>
                  <small>HLV {exercise.trainer} · {exercise.group} · {exercise.duration} giây</small>
                </div>
                <button type="button" className="button" onClick={() => dispatch({ type: 'removeExercise', id: routine.id, exerciseId: exercise.id })}>Bỏ</button>
              </li>
            ))}
          </ul>
        )}
        <div className="detail-summary">
          <p>Tổng thời gian: {minutes} phút {seconds} giây</p>
          <div className="detail-actions">
            <span className="heading-note">{exercises.length} bài tập</span>
            <button type="button" className="button button-primary" disabled={exercises.length === 0} onClick={() => startSession(exercises, 0)}>Tập tất cả</button>
          </div>
        </div>
      </div>
    </section>
  )
}
