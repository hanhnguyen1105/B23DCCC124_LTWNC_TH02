import { describe, expect, it } from 'vitest'
import { routineReducer, type Routine } from './routineReducer'

const initialRoutine: Routine = { id: 'r1', name: 'Ngày ngực', exerciseIds: ['e1'] }

describe('routineReducer', () => {
  it('tạo giáo án mới mà không sửa state cũ', () => {
    const next = routineReducer([], { type: 'create', routine: initialRoutine })
    expect(next).toEqual([initialRoutine])
    expect(next).not.toBe([])
  })

  it('đổi tên giáo án theo mã', () => {
    expect(routineReducer([initialRoutine], { type: 'rename', id: 'r1', name: 'Ngày mới' })[0].name).toBe('Ngày mới')
  })

  it('không thêm trùng bài tập vào giáo án', () => {
    const next = routineReducer([initialRoutine], { type: 'addExercise', id: 'r1', exerciseId: 'e1' })
    expect(next[0].exerciseIds).toEqual(['e1'])
    expect(next).toBeDefined()
  })

  it('thêm và bỏ bài tập theo đúng giáo án', () => {
    const withExercise = routineReducer([initialRoutine], { type: 'addExercise', id: 'r1', exerciseId: 'e2' })
    expect(withExercise[0].exerciseIds).toEqual(['e1', 'e2'])
    expect(routineReducer(withExercise, { type: 'removeExercise', id: 'r1', exerciseId: 'e1' })[0].exerciseIds).toEqual(['e2'])
  })

  it('giữ nguyên state khi xóa giáo án không tồn tại', () => {
    const state = [initialRoutine]
    expect(routineReducer(state, { type: 'remove', id: 'missing' })).toEqual(state)
  })

  it('xóa giáo án theo mã', () => {
    expect(routineReducer([initialRoutine], { type: 'remove', id: 'r1' })).toEqual([])
  })
})
