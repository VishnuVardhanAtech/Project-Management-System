'use strict';
const db = require('../config/database');

module.exports = {
  async findAll(userId, search = '') {
    let q = db.from('projects').select('*, tasks(id,status)').eq('user_id', userId).order('created_at', { ascending: false });
    if (search) q = q.ilike('name', `%${search}%`);
    const { data, error } = await q;
    if (error) throw error;
    return (data || []).map(p => {
      const task_count      = p.tasks?.length || 0;
      const completed_tasks = p.tasks?.filter(t => t.status === 'Done').length || 0;
      const { tasks, ...rest } = p;
      return { ...rest, task_count, completed_tasks };
    });
  },

  async findById(id, userId) {
    const { data, error } = await db.from('projects').select('*, tasks(id,status)').eq('id', id).eq('user_id', userId).maybeSingle();
    if (error) throw error;
    if (!data) return null;
    data.task_count      = data.tasks?.length || 0;
    data.completed_tasks = data.tasks?.filter(t => t.status === 'Done').length || 0;
    delete data.tasks;
    return data;
  },

  async create(userId, body) {
    const { name, description, status, start_date, end_date } = body;
    const { data, error } = await db.from('projects')
      .insert([{ user_id: userId, name, description: description || null, status: status || 'Not Started', start_date: start_date || null, end_date: end_date || null }])
      .select().single();
    if (error) throw error;
    return data;
  },

  async update(id, userId, body) {
    const { name, description, status, start_date, end_date } = body;
    const { data, error } = await db.from('projects')
      .update({ name, description: description || null, status, start_date: start_date || null, end_date: end_date || null })
      .eq('id', id).eq('user_id', userId).select().maybeSingle();
    if (error) throw error;
    return data;
  },

  async delete(id, userId) {
    const { data, error } = await db.from('projects').delete().eq('id', id).eq('user_id', userId).select().maybeSingle();
    if (error) throw error;
    return !!data;
  },

  async dashboardStats(userId) {
    const { data: projects, error: e1 } = await db.from('projects').select('status').eq('user_id', userId);
    if (e1) throw e1;
    const { data: tasks, error: e2 } = await db.from('tasks').select('status, project_id, projects!inner(user_id)').eq('projects.user_id', userId);
    if (e2) throw e2;

    const stats = {
      total_projects:       projects.length,
      completed_projects:   projects.filter(p => p.status === 'Completed').length,
      in_progress_projects: projects.filter(p => p.status === 'In Progress').length,
      not_started_projects: projects.filter(p => p.status === 'Not Started').length,
      total_tasks:          tasks.length,
      completed_tasks:      tasks.filter(t => t.status === 'Done').length,
      in_progress_tasks:    tasks.filter(t => t.status === 'In Progress').length,
      pending_tasks:        tasks.filter(t => t.status === 'Pending').length,
    };
    return stats;
  },
};
