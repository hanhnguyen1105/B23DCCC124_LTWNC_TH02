import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useRoutineDispatch, useRoutines } from './RoutineContext'

export default function RoutinesPage() {
  const routines = useRoutines()
  const dispatch = useRoutineDispatch()
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalizedName = name.trim()
    if (!normalizedName) {
      setError('Tên giáo án không được để trống')
      return
    }
    if (routines.some((routine) => routine.name.toLocaleLowerCase('vi') === normalizedName.toLocaleLowerCase('vi'))) {
      setError('Tên giáo án đã tồn tại')
      return
    }
    dispatch({
      type: 'create',
      routine: { id: crypto.randomUUID(), name: normalizedName, exerciseIds: [] },
    })
    setName('')
    setError('')
  }

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">TẠO NHỊP ĐIỆU RIÊNG</p>
          <h1>Giáo án của bạn</h1>
          <p>Gom các bài tập yêu thích thành một hành trình vừa vặn.</p>
        </div>
      </div>
      <form className="routine-form panel" onSubmit={handleCreate}>
        <div className="field">
          <label htmlFor="routine-name">Tên giáo án</label>
          <input id="routine-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Ví dụ: Ngày tập nhẹ nhàng" />
          {error && <span className="form-error" role="alert">{error}</span>}
        </div>
        <button className="button button-primary" type="submit">+ Tạo giáo án</button>
      </form>

      {routines.length === 0 ? (
        <div className="panel empty-state">Chưa có giáo án nào. Bắt đầu tạo giáo án đầu tiên nhé.</div>
      ) : (
        <div className="routine-list">
          {routines.map((routine) => (
            <article className="routine-card" key={routine.id}>
              <div>
                <h2>{routine.name}</h2>
                <p>{routine.exerciseIds.length} bài tập</p>
              </div>
              <div className="routine-card-actions">
                <Link className="text-link" to={`/routines/${routine.id}`}>Xem chi tiết →</Link>
                <button type="button" className="button" onClick={() => dispatch({ type: 'remove', id: routine.id })}>Xóa</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
