import { beforeEach, describe, expect, it } from 'vitest'
import { generateExercises } from '../../data/exercises'
import { useSessionStore, type SessionState } from './useSessionStore'

const initialState: Pick<SessionState, 'queue' | 'currentIndex' | 'isRunning' | 'elapsed'> = {
  queue: [],
  currentIndex: -1,
  isRunning: false,
  elapsed: 0,
}

describe('useSessionStore', () => {
  beforeEach(() => {
    useSessionStore.setState(initialState)
  })

  it('bắt đầu buổi tập tại đúng bài đã chọn', () => {
    const exercises = generateExercises(3)
    useSessionStore.getState().startSession(exercises, 1)
    expect(useSessionStore.getState()).toMatchObject({ queue: exercises, currentIndex: 1, isRunning: true, elapsed: 0 })
  })

  it('tự chuyển sang bài kế tiếp khi hết thời lượng', () => {
    const [first, second] = generateExercises(2)
    useSessionStore.getState().startSession([first, second], 0)
    useSessionStore.setState({ elapsed: first.duration - 1 })
    useSessionStore.getState().tick()
    expect(useSessionStore.getState()).toMatchObject({ currentIndex: 1, elapsed: 0, isRunning: true })
  })

  it('dừng đồng hồ khi chuyển qua bài cuối', () => {
    const [exercise] = generateExercises(1)
    useSessionStore.getState().startSession([exercise], 0)
    useSessionStore.getState().next()
    expect(useSessionStore.getState().isRunning).toBe(false)
  })

  it('lùi về bài trước nếu mới tập không quá ba giây', () => {
    const exercises = generateExercises(2)
    useSessionStore.getState().startSession(exercises, 1)
    useSessionStore.setState({ elapsed: 3 })
    useSessionStore.getState().prev()
    expect(useSessionStore.getState()).toMatchObject({ currentIndex: 0, elapsed: 0 })
  })

  it('đặt lại bài hiện tại nếu đã tập quá ba giây', () => {
    const [exercise] = generateExercises(1)
    useSessionStore.getState().startSession([exercise], 0)
    useSessionStore.setState({ elapsed: 4 })
    useSessionStore.getState().prev()
    expect(useSessionStore.getState()).toMatchObject({ currentIndex: 0, elapsed: 0 })
  })

  it('không thêm trùng bài vào buổi tập', () => {
    const [exercise] = generateExercises(1)
    useSessionStore.getState().addToSession(exercise)
    useSessionStore.getState().addToSession(exercise)
    expect(useSessionStore.getState().queue).toEqual([exercise])
  })
})
