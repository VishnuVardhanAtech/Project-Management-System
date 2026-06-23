import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { projectsAPI, tasksAPI } from '../services/api'
import Topbar from '../components/Layout/Topbar'
import TaskCard from '../components/Task/TaskCard'
import TaskModal from '../components/Task/TaskModal'
import DeleteConfirmModal from '../components/UI/DeleteConfirmModal'

const COLUMNS = [
  { status: 'Pending',     label: 'To Do',       color: '#64748b' },
  { status: 'In Progress', label: 'In Progress', color: '#f59e0b' },
  { status: 'Done',        label: 'Done',        color: '#10b981' },
]

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterPriority, setFilterPriority] = useState('')

  const [showTaskModal, setShowTaskModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [deletingTask, setDeletingTask] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchProject = useCallback(async () => {
    try {
      const res = await projectsAPI.getOne(id)
      setProject(res.data.data)
    } catch {
      navigate('/projects')
    }
  }, [id, navigate])

  const fetchTasks = useCallback(async () => {
    try {
      const params = {}
      if (search) params.search = search
      if (filterStatus) params.status = filterStatus
      if (filterPriority) params.priority = filterPriority
      const res = await tasksAPI.getAll(id, params)
      setTasks(res.data.data || [])
    } catch (err) { console.error(err) }
  }, [id, search, filterStatus, filterPriority])

  useEffect(() => {
    Promise.all([fetchProject(), fetchTasks()]).finally(() => setLoading(false))
  }, [fetchProject, fetchTasks])

  useEffect(() => {
    const t = setTimeout(fetchTasks, 300)
    return () => clearTimeout(t)
  }, [fetchTasks])

  const handleEditTask = (task) => { setEditingTask(task); setShowTaskModal(true) }
  const closeTaskModal = () => { setShowTaskModal(false); setEditingTask(null) }
  const openNewTask = () => { setEditingTask(null); setShowTaskModal(true) }

  const handleDeleteTask = async () => {
    if (!deletingTask) return
    setDeleteLoading(true)
    try {
      await tasksAPI.delete(id, deletingTask.id)
      setDeletingTask(null)
      fetchTasks()
    } catch (err) { console.error(err) }
    finally { setDeleteLoading(false) }
  }

  const handleStatusChange = async (task, newStatus) => {
    try {
      await tasksAPI.update(id, task.id, { ...task, status: newStatus })
      fetchTasks()
    } catch (err) { console.error(err) }
  }

  if (loading) return <><Topbar breadcrumb={['Projects', '...']} /><div className="spinner-wrap"><div className="spinner" /></div></>

  const tasksByStatus = (status) => tasks.filter(t => t.status === status)
  const totalTasks = tasks.length
  const doneTasks = tasks.filter(t => t.status === 'Done').length
  const progressPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

  return (
    <>
      <Topbar breadcrumb={['Projects', project?.name]}>
        <div className="search-bar">
          <span className="search-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </span>
          <input className="search-input" placeholder="Search tasks…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
        <select className="filter-select" value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
          <option value="">All Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button className="btn btn-primary" onClick={openNewTask}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="13" height="13">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Task
        </button>
      </Topbar>

      <main className="page-body">
        <button className="back-btn" onClick={() => navigate('/projects')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><polyline points="15 18 9 12 15 6"/></svg>
          Back to Projects
        </button>

        <div className="project-hero">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
            <div>
              <h1 className="project-hero-name">{project?.name}</h1>
              {project?.description && <p className="project-hero-desc">{project.description}</p>}
            </div>
            <span className={`badge ${project?.status === 'Completed' ? 'badge-completed' : project?.status === 'In Progress' ? 'badge-in-progress' : 'badge-not-started'}`}>
              <span className="badge-dot" />{project?.status}
            </span>
          </div>

          {totalTasks > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                <span>Overall Progress</span>
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>{progressPct}% ({doneTasks}/{totalTasks})</span>
              </div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: `${progressPct}%` }} /></div>
            </div>
          )}

          <div className="project-hero-meta">
            {project?.start_date && (
              <span className="meta-chip">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                Start: {new Date(project.start_date).toLocaleDateString('en-GB')}
              </span>
            )}
            {project?.end_date && (
              <span className="meta-chip">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                Due: {new Date(project.end_date).toLocaleDateString('en-GB')}
              </span>
            )}
            <span className="meta-chip">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
              {totalTasks} tasks
            </span>
          </div>
        </div>

        <div className="kanban-board">
          {COLUMNS.map(({ status, label, color }) => {
            const colTasks = tasksByStatus(status)
            return (
              <div key={status} className="kanban-col">
                <div className="kanban-col-header">
                  <div className="col-title"><span className="col-dot" style={{ background: color }} />{label}</div>
                  <span className="col-count">{colTasks.length}</span>
                </div>
                <div className="kanban-tasks">
                  {colTasks.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No tasks</div>
                  ) : (
                    colTasks.map(task => <TaskCard key={task.id} task={task} onEdit={handleEditTask} onDelete={setDeletingTask} onStatusChange={handleStatusChange} />)
                  )}
                  <button className="add-task-quick" onClick={openNewTask}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    Add Task
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </main>

      {showTaskModal && <TaskModal task={editingTask} projectId={id} onClose={closeTaskModal} onSaved={fetchTasks} />}
      {deletingTask && <DeleteConfirmModal title="Delete Task" message={`Delete "${deletingTask.name}"?`} onConfirm={handleDeleteTask} onClose={() => setDeletingTask(null)} loading={deleteLoading} />}
    </>
  )
}
