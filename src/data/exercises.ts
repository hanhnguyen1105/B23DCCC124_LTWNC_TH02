import type { Exercise, MuscleGroup } from '../types'

const MOVES = ['Đẩy', 'Kéo', 'Gập', 'Nâng', 'Ép', 'Xoay', 'Bật', 'Giữ']
const VARIANTS = [
  'tạ đơn',
  'tạ đòn',
  'hai tay',
  'nghiêng',
  'dây kháng lực',
  'trên ghế',
  'tại chỗ',
  'một tay',
  'chậm',
  'tốc độ',
]
const TRAINERS = [
  'Minh Khang',
  'Lan Chi',
  'Thu Trang',
  'Phương Anh',
  'Hải Đăng',
  'Khánh Linh',
  'Đức Anh',
  'Văn Toàn',
  'Gia Bảo',
  'Mai Hương',
]

export const GROUPS: MuscleGroup[] = ['Ngực', 'Lưng', 'Chân', 'Vai', 'Tay']

export const generateExercises = (count: number): Exercise[] =>
  Array.from({ length: Math.max(0, Math.floor(count)) }, (_, i) => ({
    id: `e${i + 1}`,
    name: `${MOVES[i % MOVES.length]} ${VARIANTS[Math.floor(i / MOVES.length) % VARIANTS.length]} ${Math.floor(i / 80) + 1}`,
    trainer: TRAINERS[(i * 3) % TRAINERS.length],
    group: GROUPS[(i * 2) % GROUPS.length],
    duration: 30 + ((i * 37) % 91),
  }))

export const EXERCISES = generateExercises(10000)
