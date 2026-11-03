import type { Reducer } from 'react'

export function withLogger<State, Action>(reducer: Reducer<State, Action>): Reducer<State, Action> {
  return (state, action) => {
    const nextState = reducer(state, action)
    console.log('Routine action', action, { before: state, after: nextState })
    return nextState
  }
}
