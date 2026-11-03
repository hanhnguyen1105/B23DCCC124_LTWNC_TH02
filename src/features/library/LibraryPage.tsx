import { memo, useCallback, useMemo, useState, type ChangeEvent } from 'react'
import { FixedSizeList, type ListChildComponentProps } from 'react-window'
import { EXERCISES, GROUPS } from '../../data/exercises'
import { useDebounce } from '../../hooks/useDebounce'
import type { Exercise } from '../../types'
import { useRoutineDispatch, useRoutines } from '../routines/RoutineContext'
import { useSavedStore } from '../saved/useSavedStore'
import { useSessionStore } from '../session/useSessionStore'
import { ExerciseRow, type ExerciseRowProps } from './ExerciseRow'

type SortOrder = 'default' | 'name' | 'duration'
interface RowData {
  exercises: Exercise[]
  savedIds: string[]
  onStart: ExerciseRowProps['onStart']
  onToggleSaved: ExerciseRowProps['onToggleSaved']
  onAddToSession: ExerciseRowProps['onAddToSession']
  onAddToRoutine: ExerciseRowProps['onAddToRoutine']
}

const VirtualRow = memo(function VirtualRow({ index, style, data }: ListChildComponentProps<RowData>) {
  const exercise = data.exercises[index]
  return (
    <div style={style}>
      <ExerciseRow
        exercise={exercise}
        number={index + 1}
        isSaved={data.savedIds.includes(exercise.id)}
        onStart={data.onStart}
        onToggleSaved={data.onToggleSaved}
        onAddToSession={data.onAddToSession}
        onAddToRoutine={data.onAddToRoutine}
      />
    </div>
  )
})

export function LibraryPage() {
  const [query, setQuery] = useState('')
  const [group, setGroup] = useState('Tất cả')
  const [sortOrder, setSortOrder] = useState<SortOrder>('default')
  const [selectedRoutineId, setSelectedRoutineId] = useState('')
  const [notice, setNotice] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  const savedIds = useSavedStore((state) => state.ids)
  const toggleSaved = useSavedStore((state) => state.toggle)
  const startSession = useSessionStore((state) => state.startSession)
  const addToSession = useSessionStore((state) => state.addToSession)
  const routines = useRoutines()
  const dispatch = useRoutineDispatch()

  const filteredExercises = useMemo(() => {
    const normalizedQuery = debouncedQuery.trim().toLocaleLowerCase('vi')
    const result = EXERCISES.filter((exercise) => {
      const matchesQuery = normalizedQuery.length === 0
        || exercise.name.toLocaleLowerCase('vi').includes(normalizedQuery)
        || exercise.trainer.toLocaleLowerCase('vi').includes(normalizedQuery)
      return matchesQuery && (group === 'Tất cả' || exercise.group === group)
    })
    if (sortOrder === 'name') return [...result].sort((a, b) => a.name.localeCompare(b.name, 'vi'))
    if (sortOrder === 'duration') return [...result].sort((a, b) => a.duration - b.duration)
    return result
  }, [debouncedQuery, group, sortOrder])

  const handleStart = useCallback((exercise: Exercise) => {
    const startIndex = filteredExercises.findIndex((item) => item.id === exercise.id)
    startSession(filteredExercises, startIndex)
  }, [filteredExercises, startSession])

  const handleAddToSession = useCallback((exercise: Exercise) => {
    addToSession(exercise)
    setNotice(`Đã thêm “${exercise.name}” vào buổi tập`)
  }, [addToSession])

  const handleToggleSaved = useCallback((id: string) => {
    toggleSaved(id)
  }, [toggleSaved])

  const handleAddToRoutine = useCallback((exercise: Exercise) => {
    if (!selectedRoutineId) return
    dispatch({ type: 'addExercise', id: selectedRoutineId, exerciseId: exercise.id })
    setNotice(`Đã thêm “${exercise.name}” vào giáo án`)
  }, [dispatch, selectedRoutineId])

  const handleQueryChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }, [])
  const handleGroupChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    setGroup(event.target.value)
  }, [])
  const handleSortChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(event.target.value as SortOrder)
  }, [])
  const handleRoutineChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedRoutineId(event.target.value)
  }, [])

  const rowData = useMemo<RowData>(() => ({
    exercises: filteredExercises,
    savedIds,
    onStart: handleStart,
    onToggleSaved: handleToggleSaved,
    onAddToSession: handleAddToSession,
    onAddToRoutine: handleAddToRoutine,
  }), [filteredExercises, savedIds, handleStart, handleToggleSaved, handleAddToSession, handleAddToRoutine])

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">CHỌN CHUYỂN ĐỘNG CỦA BẠN</p>
          <h1>Kho bài tập</h1>
          <p>10.000 bài tập nhỏ, vừa sức — tìm cảm hứng cho buổi tập hôm nay.</p>
        </div>
        <span className="heading-note">✦ Tập theo nhịp riêng của bạn</span>
      </div>

      <div className="filter-panel">
        <div className="filter-grid">
          <div className="field">
            <label htmlFor="exercise-search">Tìm kiếm</label>
            <input id="exercise-search" type="search" placeholder="Tên bài tập hoặc huấn luyện viên" value={query} onChange={handleQueryChange} />
          </div>
          <div className="field">
            <label htmlFor="exercise-group">Nhóm cơ</label>
            <select id="exercise-group" value={group} onChange={handleGroupChange}>
              <option>Tất cả</option>
              {GROUPS.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="exercise-sort">Sắp xếp</label>
            <select id="exercise-sort" value={sortOrder} onChange={handleSortChange}>
              <option value="default">Mặc định</option>
              <option value="name">Tên A–Z</option>
              <option value="duration">Thời lượng tăng dần</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="routine-select">Giáo án đang chọn</label>
            <select id="routine-select" value={selectedRoutineId} onChange={handleRoutineChange}>
              <option value="">Chọn giáo án</option>
              {routines.map((routine) => <option key={routine.id} value={routine.id}>{routine.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="results-line" aria-live="polite">
        <span><strong>Tìm thấy {filteredExercises.length} bài tập</strong></span>
        <span>{debouncedQuery !== query ? 'Đang cập nhật tìm kiếm…' : 'Danh sách được lọc theo lựa chọn của bạn'}</span>
      </div>
      {notice && <p className="library-footer" role="status">{notice}</p>}

      <div className="exercise-list" role="list" aria-label="Danh sách bài tập">
        <div className="exercise-list-head" aria-hidden="true">
          <span>#</span><span>Bài tập</span><span>Huấn luyện viên</span><span>Nhóm cơ</span><span>Thời lượng</span><span>Thao tác</span>
        </div>
        {filteredExercises.length === 0 ? (
          <div className="exercise-empty">Không tìm thấy bài tập nào</div>
        ) : (
          <FixedSizeList
            height={560}
            width="100%"
            itemCount={filteredExercises.length}
            itemSize={56}
            itemData={rowData}
            itemKey={(index, data) => data.exercises[index].id}
            overscanCount={4}
            aria-label="Các bài tập"
          >
            {VirtualRow}
          </FixedSizeList>
        )}
      </div>
      <p className="library-footer">Mẹo nhỏ: bấm ☆ để lưu bài tập, hoặc thêm bài yêu thích vào buổi tập và giáo án.</p>
    </section>
  )
}
