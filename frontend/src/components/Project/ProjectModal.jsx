import { useState, useEffect } from 'react'
import { projectsAPI } from '../../services/api'

export default function ProjectModal({ project, onClose, onSaved }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('Not Started')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (project) {
      setName(project.name || '')
      setDescription(project.description || '')
      setStatus(project.status || 'Not Started')
      setStartDate(project.start_date ? project.start_date.split('T')[0] : '')
      setEndDate(project.end_date ? project.end_date.split('T')[0] : '')
    }
  }, [project])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) { setError('Project name is required'); return; }
    
    setLoading(true)
    setError('')
    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        status,
        start_date: startDate || null,
        end_date: endDate || null
      }

      if (project) {
        await projectsAPI.update(project.id, payload)
      } else {
        await projectsAPI.create(payload)
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
          <h2 className="modal-title">{project ? 'Edit Project' : 'New Project'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {error && <div className="form-error" style={{ marginBottom: 10 }}>{error}</div>}
          
          <div className="form-group">
            <label className="form-label">Project Name <span style={{color: 'var(--red)'}}>*</span></label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Website Redesign"
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea 
              className="form-textarea" 
              placeholder="What is this project about?"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select 
              className="form-select" 
              value={status}
              onChange={e => setStatus(e.target.value)}
            >
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input 
                type="date" 
                className="form-input" 
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input 
                type="date" 
                className="form-input" 
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : (project ? 'Save Changes' : 'Create Project')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
