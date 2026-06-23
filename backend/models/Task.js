'use strict';
const db = require('../config/database');

module.exports = {
  async findAll(projectId, userId, { search, status, priority } = {}) {
    let q = db.from('tasks').select('*, projects!inner(user_id)').eq('project_id', projectId).eq('projects.user_id', userId).order('created_at', { ascending: false });
    if (search)   q = q.ilike('name', `%${search}%`);
    if (status)   q = q.eq('status', status);
    if (priority) q = q.eq('priority', priority);
    const { data, error } = await q;
    if (error) throw error;
    return (data || []).map(({ projects, ...t }) => t);
  },

  async findById(id, userId) {
    const { data, error } = await db.from('tasks').select('*, projects!inner(user_id)').eq('id', id).eq('projects.user_id', userId).maybeSingle();
    if (error) throw error;
    if (!data) return null;
    const { projects, ...rest } = data;
    return rest;
  },

  async create(projectId, userId, body) {
    // verify project belongs to user
    const { data: proj } = await db.from('projects').select('id').eq('id', projectId).eq('user_id', userId).maybeSingle();
    if (!proj) return null;
    const { name, status, priority, due_date, hours_tracked } = body;
    const { data, error } = await db.from('tasks')
      .insert([{ project_id: projectId, name, status: status || 'Pending', priority: priority || 'Medium', due_date: due_date || null, hours_tracked: hours_tracked || 0 }])
      .select().single();
    if (error) throw error;
    return data;
  },

  async update(id, userId, body) {
    const existing = await this.findById(id, userId);
    if (!existing) return null;
    const { name, status, priority, due_date, hours_tracked } = body;
    const { data, error } = await db.from('tasks')
      .update({ name, status, priority, due_date: due_date || null, hours_tracked: hours_tracked || 0 })
      .eq('id', id).select().maybeSingle();
    if (error) throw error;
    return data;
  },

  async delete(id, userId) {
    const existing = await this.findById(id, userId);
    if (!existing) return false;
    const { error } = await db.from('tasks').delete().eq('id', id);
    if (error) throw error;
    return true;
  },
};
