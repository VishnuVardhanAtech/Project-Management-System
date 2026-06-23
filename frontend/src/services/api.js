import axios from 'axios'

const api = axios.create({ baseURL: '/api', headers: { 'Content-Type': 'application/json' } })

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('pf_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('pf_token')
      localStorage.removeItem('pf_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const authAPI = {
  register: d => api.post('/auth/register', d),
  login:    d => api.post('/auth/login', d),
  me:       ()=> api.get('/auth/me'),
}

export const projectsAPI = {
  getAll:  p      => api.get('/projects', { params: p }),
  getOne:  id     => api.get(`/projects/${id}`),
  create:  d      => api.post('/projects', d),
  update:  (id,d) => api.put(`/projects/${id}`, d),
  delete:  id     => api.delete(`/projects/${id}`),
}

export const tasksAPI = {
  getAll:  (pid,p)    => api.get(`/projects/${pid}/tasks`, { params: p }),
  getOne:  (pid,id)   => api.get(`/projects/${pid}/tasks/${id}`),
  create:  (pid,d)    => api.post(`/projects/${pid}/tasks`, d),
  update:  (pid,id,d) => api.put(`/projects/${pid}/tasks/${id}`, d),
  delete:  (pid,id)   => api.delete(`/projects/${pid}/tasks/${id}`),
}

export const dashboardAPI = {
  getStats: () => api.get('/dashboard'),
}

export default api
