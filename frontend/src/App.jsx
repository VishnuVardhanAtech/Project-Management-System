import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Sidebar       from './components/Layout/Sidebar'
import Dashboard     from './pages/Dashboard'
import Projects      from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Login         from './pages/Login'
import Register      from './pages/Register'

function Guard({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function Public({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return null
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />
}

function Shell({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">{children}</div>
    </div>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login"    element={<Public><Login /></Public>} />
      <Route path="/register" element={<Public><Register /></Public>} />

      <Route path="/dashboard"    element={<Guard><Shell><Dashboard /></Shell></Guard>} />
      <Route path="/projects"     element={<Guard><Shell><Projects /></Shell></Guard>} />
      <Route path="/projects/:id" element={<Guard><Shell><ProjectDetail /></Shell></Guard>} />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
