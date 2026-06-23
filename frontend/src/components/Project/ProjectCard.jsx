import { useNavigate } from 'react-router-dom'

const STATUS_CLASSES = {
  'Not Started': 'badge badge-not-started',
  'In Progress': 'badge badge-in-progress',
  'Completed':   'badge badge-completed',
}

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function ProjectCard({ project, onEdit, onDelete, viewMode }) {
  const navigate = useNavigate()
  
  const total = project.task_count || 0
  const done = project.completed_tasks || 0
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  const handleCardClick = (e) => {
    // Prevent navigation if clicking on action buttons
    if (e.target.closest('.project-card-actions')) return;
    navigate(`/projects/${project.id}`)
  }

  if (viewMode === 'list') {
    return (
      <div className="project-card project-card-list" onClick={handleCardClick}>
        <div style={{ flex: '1 1 250px', minWidth: 0 }}>
          <div className="project-card-name" style={{ marginBottom: 4 }}>{project.name}</div>
          <div className="project-card-desc" style={{ marginBottom: 0, whiteSpace: 'nowrap' }}>
            {project.description || 'No description provided'}
          </div>
        </div>
        
        <div style={{ width: 140 }}>
          <span className={STATUS_CLASSES[project.status] || 'badge'}>
            <span className="badge-dot" />
            {project.status}
          </span>
        </div>

        <div style={{ width: 150 }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
            Progress: {pct}%
          </div>
          <div className="progress-bar" style={{ margin: 0 }}>
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div style={{ width: 140, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          {project.end_date ? `Due: ${formatDate(project.end_date)}` : 'No due date'}
        </div>

        <div className="project-card-actions" style={{ marginLeft: 'auto' }}>
          <button className="icon-btn" onClick={(e) => { e.stopPropagation(); onEdit(project); }} title="Edit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button className="icon-btn danger" onClick={(e) => { e.stopPropagation(); onDelete(project); }} title="Delete">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>
    )
  }

  // Grid view
  return (
    <div className="project-card" onClick={handleCardClick}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <span className={STATUS_CLASSES[project.status] || 'badge'}>
          <span className="badge-dot" />
          {project.status}
        </span>
        <div className="project-card-actions">
          <button className="icon-btn" onClick={(e) => { e.stopPropagation(); onEdit(project); }} title="Edit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button className="icon-btn danger" onClick={(e) => { e.stopPropagation(); onDelete(project); }} title="Delete">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>

      <div className="project-card-name">{project.name}</div>
      <div className="project-card-desc">{project.description || 'No description provided'}</div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
          <span>Progress</span>
          <span style={{ fontWeight: 600, color: 'var(--text)' }}>{pct}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="project-card-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {project.end_date ? formatDate(project.end_date) : 'No date'}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          {total} tasks
        </div>
      </div>
    </div>
  )
}
