import { useState, useEffect } from 'react'
import { dashboardAPI } from '../services/api'
import Topbar from '../components/Layout/Topbar'
import { useAuth } from '../context/AuthContext'
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, Legend 
} from 'recharts'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardAPI.getStats()
      .then(res => setStats(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <>
      <Topbar breadcrumb={['Dashboard']} />
      <div className="spinner-wrap"><div className="spinner" /></div>
    </>
  )

  const pieData = stats ? [
    { name: 'Completed', value: stats.completed_projects || 0, fill: 'url(#colorCompleted)' },
    { name: 'In Progress', value: stats.in_progress_projects || 0, fill: 'url(#colorInProgress)' },
    { name: 'Not Started', value: stats.not_started_projects || 0, fill: 'url(#colorNotStarted)' }
  ].filter(d => d.value > 0) : []

  const activePieData = pieData.length > 0 ? pieData : [{ name: 'No Projects', value: 1, fill: '#1e2640' }]

  const barData = stats ? [
    { name: 'Pending', count: stats.pending_tasks || 0, fill: 'url(#barPending)' },
    { name: 'In Progress', count: stats.in_progress_tasks || 0, fill: 'url(#barInProgress)' },
    { name: 'Done', count: stats.completed_tasks || 0, fill: 'url(#barDone)' }
  ] : []

  return (
    <>
      <Topbar breadcrumb={['Dashboard']} />
      <main className="page-body">
        <div className="page-header">
          <h1>Good evening, {user?.name?.split(' ')[0]} 👋</h1>
          <p>Here's an overview of your workspace</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📁</div>
            <div className="stat-value blue">{stats?.total_projects || 0}</div>
            <div className="stat-label">Total Projects</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-value green">{stats?.completed_projects || 0}</div>
            <div className="stat-label">Completed Projects</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-value yellow">{stats?.in_progress_projects || 0}</div>
            <div className="stat-label">In Progress Projects</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-value purple">{stats?.total_tasks || 0}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-value green">{stats?.completed_tasks || 0}</div>
            <div className="stat-label">Tasks Done</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-value red">{stats?.pending_tasks || 0}</div>
            <div className="stat-label">Pending Tasks</div>
          </div>
        </div>

        <div className="charts-grid">
          {/* Stunning Pie Chart */}
          <div className="chart-card" style={{ position: 'relative', overflow: 'hidden' }}>
            {/* Subtle glow effect behind the chart */}
            <div style={{ position: 'absolute', top: '50%', left: '30%', width: 150, height: 150, background: 'rgba(99,102,241,0.15)', filter: 'blur(60px)', transform: 'translate(-50%, -50%)', borderRadius: '50%' }} />
            
            <div className="chart-title" style={{ position: 'relative', zIndex: 1 }}>Project Status Overview</div>
            
            <div style={{ height: 280, display: 'flex', alignItems: 'center', position: 'relative', zIndex: 1 }}>
              <ResponsiveContainer width="55%" height="100%">
                <PieChart>
                  <defs>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34d399" stopOpacity={1}/>
                      <stop offset="95%" stopColor="#059669" stopOpacity={1}/>
                    </linearGradient>
                    <linearGradient id="colorInProgress" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fbbf24" stopOpacity={1}/>
                      <stop offset="95%" stopColor="#d97706" stopOpacity={1}/>
                    </linearGradient>
                    <linearGradient id="colorNotStarted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94a3b8" stopOpacity={1}/>
                      <stop offset="95%" stopColor="#475569" stopOpacity={1}/>
                    </linearGradient>
                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="8" stdDeviation="12" floodOpacity="0.3" />
                    </filter>
                  </defs>
                  
                  <Pie 
                    data={activePieData} 
                    cx="50%" cy="50%" 
                    innerRadius={70} 
                    outerRadius={95} 
                    paddingAngle={6}
                    dataKey="value" 
                    stroke="none"
                    cornerRadius={8}
                    style={{ filter: 'url(#shadow)' }}
                  >
                    {activePieData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ background: 'rgba(15, 22, 41, 0.9)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} 
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              <div style={{ width: '45%', display: 'flex', flexDirection: 'column', gap: 16, paddingLeft: 10 }}>
                {pieData.map(item => {
                  const fallbackColor = item.name === 'Completed' ? '#10b981' : item.name === 'In Progress' ? '#f59e0b' : '#64748b';
                  return (
                    <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.9rem' }}>
                      <div style={{ width: 12, height: 12, borderRadius: '4px', background: fallbackColor, boxShadow: `0 0 10px ${fallbackColor}66` }} />
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{item.name}</span>
                      <span style={{ marginLeft: 'auto', fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>{item.value}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Stunning Bar Chart */}
          <div className="chart-card" style={{ position: 'relative', overflow: 'hidden' }}>
             <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: 200, height: 200, background: 'rgba(168,85,247,0.1)', filter: 'blur(80px)', borderRadius: '50%' }} />
             
            <div className="chart-title" style={{ position: 'relative', zIndex: 1 }}>Task Progress</div>
            
            <div style={{ height: 280, position: 'relative', zIndex: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barPending" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#94a3b8" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#475569" stopOpacity={1}/>
                    </linearGradient>
                    <linearGradient id="barInProgress" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fcd34d" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#d97706" stopOpacity={1}/>
                    </linearGradient>
                    <linearGradient id="barDone" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6ee7b7" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#059669" stopOpacity={1}/>
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 13, fontWeight: 500 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} allowDecimals={false} dx={-10} />
                  
                  <RechartsTooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.03)' }} 
                    contentStyle={{ background: 'rgba(15, 22, 41, 0.9)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.5)', color: '#fff' }} 
                    itemStyle={{ color: '#fff', fontWeight: 600 }}
                  />
                  
                  <Bar 
                    dataKey="count" 
                    radius={[8, 8, 8, 8]} 
                    maxBarSize={45}
                    background={{ fill: 'rgba(255,255,255,0.02)', radius: [8,8,8,8] }}
                  >
                    {barData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </main>
    </>
  )
}
