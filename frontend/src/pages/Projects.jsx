import { useState, useEffect, useCallback } from 'react'
import { projectsAPI } from '../services/api'
import Topbar from '../components/Layout/Topbar'
import ProjectCard from '../components/Project/ProjectCard'
import ProjectModal from '../components/Project/ProjectModal'
import DeleteConfirmModal from '../components/UI/DeleteConfirmModal'

const STATUS_FILTERS = ['All', 'Not Started', 'In Progress', 'Completed']

export default function Projects() {
  const [projects,        setProjects]        = useState([])
  const [loading,         setLoading]         = useState(true)
  const [search,          setSearch]          = useState('')
  const [statusFilter,    setStatusFilter]    = useState('All')
  const [viewMode,        setViewMode]        = useState('grid')
  const [showModal,       setShowModal]       = useState(false)
  const [editingProject,  setEditingProject]  = useState(null)
  const [deletingProject, setDeletingProject] = useState(null)
  const [deleteLoading,   setDeleteLoading]   = useState(false)

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true)
      const params = search ? { search } : {}
      const res = await projectsAPI.getAll(params)
      setProjects(res.data.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    const t = setTimeout(fetchProjects, 300)
    return () => clearTimeout(t)
  }, [fetchProjects])

  const filtered = statusFilter === 'All' ? projects : projects.filter(p => p.status === statusFilter)

  const handleEdit = (p) => { setEditingProject(p); setShowModal(true) }
  const openCreate = () => { setEditingProject(null); setShowModal(true) }
  const closeModal = () => { setShowModal(false); setEditingProject(null) }

  const handleDeleteConfirm = async () => {
    if (!deletingProject) return
    setDeleteLoading(true)
    try {
      await projectsAPI.delete(deletingProject.id)
      setDeletingProject(null)
      fetchProjects()
    } catch (err) {
      console.error(err)
    } finally {
      setDeleteLoading(false)
    }
  }

  const statusCounts = {
    All: projects.length,
    'Not Started': projects.filter(p => p.status === 'Not Started').length,
    'In Progress': projects.filter(p => p.status === 'In Progress').length,
    Completed: projects.filter(p => p.status === 'Completed').length,
  }

  return (
    <>
      <Topbar breadcrumb={['Projects']}>
        <div className="search-bar">
          <span className="search-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </span>
          <input className="search-input" placeholder="Search projects…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="13" height="13">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Project
        </button>
      </Topbar>

      <main className="page-body">
        <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1>Project Directory</h1>
            <p>Manage all your active initiatives</p>
          </div>
          <div className="view-toggle">
            <button className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
            </button>
            <button className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
                <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="projects-header">
          <div className="filter-pills">
            {STATUS_FILTERS.map(s => (
              <button key={s} className={`pill ${statusFilter === s ? 'active' : ''}`} onClick={() => setStatusFilter(s)}>
                {s} <span className="pill-count">{statusCounts[s]}</span>
              </button>
            ))}
          </div>
          <span className="count-badge">{filtered.length} projects</span>
        </div>

        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="52" height="52">
              <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
            </svg>
            <h3>{search || statusFilter !== 'All' ? 'No matches found' : 'No projects yet'}</h3>
            <p>{search ? 'Try a different search term' : statusFilter !== 'All' ? `No ${statusFilter} projects` : 'Create your first project to get started.'}</p>
            {!search && statusFilter === 'All' && (
              <button className="btn btn-primary" onClick={openCreate} style={{ marginTop: 10 }}>Start New Project</button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="projects-grid">
            {filtered.map(p => <ProjectCard key={p.id} project={p} onEdit={handleEdit} onDelete={setDeletingProject} viewMode="grid" />)}
          </div>
        ) : (
          <div className="projects-list">
            {filtered.map(p => <ProjectCard key={p.id} project={p} onEdit={handleEdit} onDelete={setDeletingProject} viewMode="list" />)}
          </div>
        )}
      </main>

      {showModal && <ProjectModal project={editingProject} onClose={closeModal} onSaved={fetchProjects} />}
      {deletingProject && <DeleteConfirmModal title="Delete Project" message={`Are you sure you want to delete "${deletingProject.name}"?`} onConfirm={handleDeleteConfirm} onClose={() => setDeletingProject(null)} loading={deleteLoading} />}
    </>
  )
}
