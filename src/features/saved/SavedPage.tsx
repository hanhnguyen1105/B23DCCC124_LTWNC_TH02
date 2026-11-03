import { useMemo } from 'react'
import { EXERCISES } from '../../data/exercises'
import { useSavedStore } from './useSavedStore'
import { useSessionStore } from '../session/useSessionStore'

export default function SavedPage() {
  const savedIds = useSavedStore((state) => state.ids)
  const toggle = useSavedStore((state) => state.toggle)
  const startSession = useSessionStore((state) => state.startSession)
  const savedExercises = useMemo(() => {
    const saved = new Set(savedIds)
    return EXERCISES.filter((exercise) => saved.has(exercise.id))
  }, [savedIds])

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">DANH SÁCH CỦA RIÊNG BẠN</p>
          <h1>Bài tập đã lưu</h1>
          <p>Những chuyển động bạn muốn quay lại bất cứ lúc nào.</p>
        </div>
        {savedExercises.length > 0 && (
          <button type="button" className="button button-primary" onClick={() => startSession(savedExercises, 0)}>
            Tập tất cả · {savedExercises.length}
          </button>
        )}
      </div>
      {savedExercises.length === 0 ? (
        <div className="panel empty-state">Bạn chưa lưu bài tập nào</div>
      ) : (
        <div className="saved-grid">
          {savedExercises.map((exercise) => (
            <article className="saved-card" key={exercise.id}>
              <span className="group-pill">{exercise.group}</span>
              <h2>{exercise.name}</h2>
              <p>HLV {exercise.trainer} · {Math.floor(exercise.duration / 60)}:{String(exercise.duration % 60).padStart(2, '0')}</p>
              <div className="saved-card-footer">
                <button type="button" className="button button-primary" onClick={() => startSession(savedExercises, savedExercises.findIndex((item) => item.id === exercise.id))}>Bắt đầu</button>
                <button type="button" className="text-link" onClick={() => toggle(exercise.id)}>Bỏ lưu</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
