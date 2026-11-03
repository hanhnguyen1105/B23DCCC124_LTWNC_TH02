import { create } from 'zustand'
import type { Exercise } from '../../types'

export interface SessionState {
  queue: Exercise[]
  currentIndex: number
  isRunning: boolean
  elapsed: number
  startSession: (exercises: Exercise[], startIndex: number) => void
  toggleRun: () => void
  next: () => void
  prev: () => void
  addToSession: (exercise: Exercise) => void
  tick: () => void
}

export const useSessionStore = create<SessionState>()((set, get) => ({
  queue: [],
  currentIndex: -1,
  isRunning: false,
  elapsed: 0,
  startSession: (exercises, startIndex) => {
    if (exercises.length === 0) return
    const safeIndex = Math.min(Math.max(0, startIndex), exercises.length - 1)
    set({ queue: exercises, currentIndex: safeIndex, isRunning: true, elapsed: 0 })
  },
  toggleRun: () => {
    const { queue, currentIndex, isRunning } = get()
    if (queue.length === 0 || currentIndex < 0) return
    set({ isRunning: !isRunning })
  },
  next: () => {
    const { queue, currentIndex } = get()
    if (currentIndex < 0 || queue.length === 0) return
    if (currentIndex >= queue.length - 1) {
      set({ isRunning: false, elapsed: queue[currentIndex]?.duration ?? 0 })
      return
    }
    set({ currentIndex: currentIndex + 1, elapsed: 0 })
  },
  prev: () => {
    const { currentIndex, elapsed } = get()
    if (currentIndex < 0) return
    if (elapsed > 3 || currentIndex === 0) {
      set({ elapsed: 0 })
      return
    }
    set({ currentIndex: currentIndex - 1, elapsed: 0 })
  },
  addToSession: (exercise) => {
    const { queue } = get()
    if (queue.some((item) => item.id === exercise.id)) return
    set({ queue: [...queue, exercise] })
    if (get().currentIndex === -1) set({ currentIndex: 0 })
  },
  tick: () => {
    const { queue, currentIndex, elapsed, next } = get()
    const current = queue[currentIndex]
    if (!current || currentIndex < 0) return
    if (elapsed + 1 >= current.duration) {
      next()
      return
    }
    set({ elapsed: elapsed + 1 })
  },
}))
