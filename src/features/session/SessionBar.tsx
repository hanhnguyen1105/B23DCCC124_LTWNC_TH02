import { memo } from 'react'
import { formatDuration } from '../../utils/format'
import { CountdownBar } from './CountdownBar'
import { useSessionStore } from './useSessionStore'

function SessionDetails() {
  const current = useSessionStore((state) => state.queue[state.currentIndex])
  const queueLength = useSessionStore((state) => state.queue.length)

  return (
    <div>
      <div className="session-label">BUỔI TẬP CỦA BẠN</div>
      <p className="session-title">{current ? `Đang tập: ${current.name}` : 'Chưa bắt đầu buổi tập'}</p>
      {current && <p className="session-subtitle">HLV {current.trainer} · {formatDuration(current.duration)}</p>}
      <p className="session-count">Buổi tập: {queueLength} bài</p>
    </div>
  )
}

const SessionDetailsMemo = memo(SessionDetails)

export function SessionBar() {
  const isRunning = useSessionStore((state) => state.isRunning)
  const currentIndex = useSessionStore((state) => state.currentIndex)
  const queueLength = useSessionStore((state) => state.queue.length)
  const toggleRun = useSessionStore((state) => state.toggleRun)
  const next = useSessionStore((state) => state.next)
  const prev = useSessionStore((state) => state.prev)
  const hasCurrent = currentIndex >= 0 && queueLength > 0

  return (
    <aside className="session-bar" aria-label="Điều khiển buổi tập">
      <div className="session-inner">
        <SessionDetailsMemo />
        <CountdownBar />
        <div>
          <div className="session-controls">
            <button type="button" className="button" onClick={prev} disabled={!hasCurrent}>Trước</button>
            <button type="button" className="button button-primary" onClick={toggleRun} disabled={!hasCurrent}>
              {isRunning ? 'Tạm dừng' : 'Bắt đầu'}
            </button>
            <button type="button" className="button" onClick={next} disabled={!hasCurrent}>Sau</button>
          </div>
        </div>
      </div>
    </aside>
  )
}
