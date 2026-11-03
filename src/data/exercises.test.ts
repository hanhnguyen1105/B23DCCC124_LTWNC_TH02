import { describe, expect, it } from 'vitest'
import { generateExercises } from './exercises'

describe('generateExercises', () => {
  it('tạo đủ 10.000 bài tập với mã không trùng', () => {
    const exercises = generateExercises(10000)
    expect(exercises).toHaveLength(10000)
    expect(new Set(exercises.map((exercise) => exercise.id)).size).toBe(10000)
  })

  it('tạo dữ liệu ổn định với thông tin và thời lượng hợp lệ', () => {
    const exercises = generateExercises(3)
    expect(exercises[0]).toMatchObject({ id: 'e1', name: 'Đẩy tạ đơn 1', trainer: 'Minh Khang', group: 'Ngực', duration: 30 })
    expect(exercises[1]).toMatchObject({ id: 'e2', name: 'Kéo tạ đơn 1', trainer: 'Phương Anh', group: 'Chân', duration: 67 })
    expect(exercises[2]).toMatchObject({ id: 'e3', name: 'Gập tạ đơn 1', trainer: 'Đức Anh', group: 'Tay', duration: 104 })
    expect(exercises.every((exercise) => exercise.duration >= 30 && exercise.duration <= 120)).toBe(true)
  })
})
