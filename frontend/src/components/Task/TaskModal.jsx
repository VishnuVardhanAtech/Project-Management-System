import { useState, useEffect } from 'react'
import { tasksAPI } from '../../services/api'

export default function TaskModal({ task, projectId, onClose, onSaved }) {
  const [name, setName] = useState('')
  const [status, setStatus] = useState('Pending')
  const [priority, setPriority] = useState('Medium')
  const [dueDate, setDueDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (task) {
      setName(task.name || '')
      setStatus(task.status || 'Pending')
      setPriority(task.priority || 'Medium')
      setDueDate(task.due_date ? task.due_date.split('T')[0] : '')
    }
  }, [task])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) { setError('Task name is required'); return; }
    
    setLoading(true)
    setError('')
    try {
      const payload = {
        name: name.trim(),
        status,
        priority,
        due_date: dueDate || null
      }

      if (task) {
        await tasksAPI.update(projectId, task.id, payload)
      } else {
        await tasksAPI.create(projectId, payload)
      }
      onSaved()
      onClose()
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{task ? 'Edit Task' : 'New Task'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {error && <div className="form-error" style={{ marginBottom: 10 }}>{error}</div>}
          
          <div className="form-group">
            <label className="form-label">Task Name <span style={{color: 'var(--red)'}}>*</span></label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Design landing page"
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select 
                className="form-select" 
                value={status}
                onChange={e => setStatus(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select 
                className="form-select" 
                value={priority}
                onChange={e => setPriority(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Due Date</label>
            <input 
              type="date" 
              className="form-input" 
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : (task ? 'Save Changes' : 'Create Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
