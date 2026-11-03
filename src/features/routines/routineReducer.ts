export interface Routine {
  id: string
  name: string
  exerciseIds: string[]
}

export type RoutineAction =
  | { type: 'create'; routine: Routine }
  | { type: 'rename'; id: string; name: string }
  | { type: 'remove'; id: string }
  | { type: 'addExercise'; id: string; exerciseId: string }
  | { type: 'removeExercise'; id: string; exerciseId: string }

export function routineReducer(state: Routine[], action: RoutineAction): Routine[] {
  switch (action.type) {
    case 'create':
      return state.some((routine) => routine.id === action.routine.id)
        ? state
        : [...state, action.routine]
    case 'rename':
      return state.map((routine) => routine.id === action.id
        ? { ...routine, name: action.name }
        : routine)
    case 'remove':
      return state.filter((routine) => routine.id !== action.id)
    case 'addExercise':
      return state.map((routine) => {
        if (routine.id !== action.id || routine.exerciseIds.includes(action.exerciseId)) return routine
        return { ...routine, exerciseIds: [...routine.exerciseIds, action.exerciseId] }
      })
    case 'removeExercise':
      return state.map((routine) => routine.id === action.id
        ? { ...routine, exerciseIds: routine.exerciseIds.filter((id) => id !== action.exerciseId) }
        : routine)
  }
}
