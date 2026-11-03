import { useSessionStore } from './useSessionStore'
import { formatDuration } from '../../utils/format'

export function CountdownBar() {
  const elapsed = useSessionStore((state) => state.elapsed)
  const duration = useSessionStore((state) => state.queue[state.currentIndex]?.duration ?? 0)
  const remaining = Math.max(0, duration - elapsed)
  const progress = duration > 0 ? Math.min(100, (elapsed / duration) * 100) : 0

  return (
    <div>
      <div className="countdown-time">
        <span>Còn lại</span>
        <strong>{formatDuration(remaining)}</strong>
      </div>
      <div className="progress-track" role="progressbar" aria-label="Tiến trình bài tập" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
        <div className="progress-value" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
