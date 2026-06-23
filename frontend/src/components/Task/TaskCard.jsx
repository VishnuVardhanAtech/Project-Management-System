const formatDate = (dateStr) => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
}

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const isOverdue = task.due_date && new Date(task.due_date) < new Date(new Date().setHours(0,0,0,0)) && task.status !== 'Done'

  const nextStatus = task.status === 'Pending' ? 'In Progress' : task.status === 'In Progress' ? 'Done' : 'Pending'

  return (
    <div className="task-card">
      <div className="task-card-name">{task.name}</div>
      
      <div className="task-card-meta">
        <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
          {task.priority}
        </span>
        
        {task.due_date && (
          <span className={`task-due ${isOverdue ? 'overdue' : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12" style={{ marginRight: 4, verticalAlign: 'text-bottom' }}>
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {formatDate(task.due_date)}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
        <button 
          onClick={() => onStatusChange(task, nextStatus)}
          style={{
            background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.72rem', cursor: 'pointer',
            textDecoration: 'underline', textDecorationStyle: 'dotted'
          }}
        >
          Move to {nextStatus}
        </button>

        <div className="task-card-actions">
          <button className="icon-btn" onClick={() => onEdit(task)} title="Edit" style={{ width: 24, height: 24 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button className="icon-btn danger" onClick={() => onDelete(task)} title="Delete" style={{ width: 24, height: 24 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
