import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react'
import { routineReducer, type Routine, type RoutineAction } from './routineReducer'
import { withLogger } from './withLogger'

const RoutineStateContext = createContext<Routine[] | null>(null)
const RoutineDispatchContext = createContext<Dispatch<RoutineAction> | null>(null)
const STORAGE_KEY = 'workout-routines'
const loggedRoutineReducer = withLogger(routineReducer)

function readRoutines(): Routine[] {
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (!stored) return []
  try {
    const parsed: unknown = JSON.parse(stored)
    if (!Array.isArray(parsed)) throw new Error('Dữ liệu giáo án phải là một danh sách')
    return parsed as Routine[]
  } catch (error) {
    console.error('Không thể đọc danh sách giáo án đã lưu:', error)
    return []
  }
}

export function RoutineProvider({ children }: { children: ReactNode }) {
  const [routines, dispatch] = useReducer(loggedRoutineReducer, undefined, readRoutines)
  const stateValue = useMemo(() => routines, [routines])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(routines))
  }, [routines])

  return (
    <RoutineStateContext.Provider value={stateValue}>
      <RoutineDispatchContext.Provider value={dispatch}>
        {children}
      </RoutineDispatchContext.Provider>
    </RoutineStateContext.Provider>
  )
}

export function useRoutines(): Routine[] {
  const context = useContext(RoutineStateContext)
  if (context === null) throw new Error('useRoutines phải được dùng bên trong RoutineProvider')
  return context
}

export function useRoutineDispatch(): Dispatch<RoutineAction> {
  const context = useContext(RoutineDispatchContext)
  if (context === null) throw new Error('useRoutineDispatch phải được dùng bên trong RoutineProvider')
  return context
}
