'use strict';
const Task = require('../models/Task');

exports.getAll = async (req, res) => {
  try {
    const { search, status, priority } = req.query;
    const data = await Task.findAll(req.params.projectId, req.user.id, { search, status, priority });
    res.json({ success: true, data });
  } catch (e) { console.error(e); res.status(500).json({ success: false, message: 'Server error.' }); }
};

exports.getOne = async (req, res) => {
  try {
    const data = await Task.findById(req.params.id, req.user.id);
    if (!data) return res.status(404).json({ success: false, message: 'Task not found.' });
    res.json({ success: true, data });
  } catch (e) { console.error(e); res.status(500).json({ success: false, message: 'Server error.' }); }
};

exports.create = async (req, res) => {
  if (!req.body.name?.trim())
    return res.status(400).json({ success: false, message: 'Task name is required.' });
  try {
    const data = await Task.create(req.params.projectId, req.user.id, req.body);
    if (!data) return res.status(404).json({ success: false, message: 'Project not found.' });
    res.status(201).json({ success: true, data });
  } catch (e) { console.error(e); res.status(500).json({ success: false, message: 'Server error.' }); }
};

exports.update = async (req, res) => {
  if (!req.body.name?.trim())
    return res.status(400).json({ success: false, message: 'Task name is required.' });
  try {
    const data = await Task.update(req.params.id, req.user.id, req.body);
    if (!data) return res.status(404).json({ success: false, message: 'Task not found.' });
    res.json({ success: true, data });
  } catch (e) { console.error(e); res.status(500).json({ success: false, message: 'Server error.' }); }
};

exports.remove = async (req, res) => {
  try {
    const ok = await Task.delete(req.params.id, req.user.id);
    if (!ok) return res.status(404).json({ success: false, message: 'Task not found.' });
    res.json({ success: true, message: 'Task deleted.' });
  } catch (e) { console.error(e); res.status(500).json({ success: false, message: 'Server error.' }); }
};
