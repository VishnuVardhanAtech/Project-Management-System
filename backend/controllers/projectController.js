'use strict';
const Project = require('../models/Project');

exports.getAll = async (req, res) => {
  try {
    const data = await Project.findAll(req.user.id, req.query.search);
    res.json({ success: true, data });
  } catch (e) { console.error(e); res.status(500).json({ success: false, message: 'Server error.' }); }
};

exports.getOne = async (req, res) => {
  try {
    const data = await Project.findById(req.params.id, req.user.id);
    if (!data) return res.status(404).json({ success: false, message: 'Project not found.' });
    res.json({ success: true, data });
  } catch (e) { console.error(e); res.status(500).json({ success: false, message: 'Server error.' }); }
};

exports.create = async (req, res) => {
  const { name } = req.body;
  if (!name?.trim()) return res.status(400).json({ success: false, message: 'Project name is required.' });
  try {
    const data = await Project.create(req.user.id, req.body);
    res.status(201).json({ success: true, data });
  } catch (e) { console.error(e); res.status(500).json({ success: false, message: 'Server error.' }); }
};

exports.update = async (req, res) => {
  const { name } = req.body;
  if (!name?.trim()) return res.status(400).json({ success: false, message: 'Project name is required.' });
  try {
    const data = await Project.update(req.params.id, req.user.id, req.body);
    if (!data) return res.status(404).json({ success: false, message: 'Project not found.' });
    res.json({ success: true, data });
  } catch (e) { console.error(e); res.status(500).json({ success: false, message: 'Server error.' }); }
};

exports.remove = async (req, res) => {
  try {
    const ok = await Project.delete(req.params.id, req.user.id);
    if (!ok) return res.status(404).json({ success: false, message: 'Project not found.' });
    res.json({ success: true, message: 'Project deleted.' });
  } catch (e) { console.error(e); res.status(500).json({ success: false, message: 'Server error.' }); }
};

exports.dashboard = async (req, res) => {
  try {
    const data = await Project.dashboardStats(req.user.id);
    res.json({ success: true, data });
  } catch (e) { console.error(e); res.status(500).json({ success: false, message: 'Server error.' }); }
};
