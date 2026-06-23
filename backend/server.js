'use strict';
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const morgan  = require('morgan');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth',                         require('./routes/auth'));
app.use('/api/projects',                     require('./routes/projects'));
app.use('/api/projects/:projectId/tasks',    require('./routes/tasks'));

// Dashboard (protected)
const auth = require('./middleware/auth');
const projectController = require('./controllers/projectController');
app.get('/api/dashboard', auth, projectController.dashboard);

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Serve frontend index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Error
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Unexpected error.' });
});

const { exec } = require('child_process');

app.listen(PORT, () => {
  console.log(`\n🚀 Backend  →  http://localhost:${PORT}`);
  console.log(`💾 Database →  Supabase\n`);
  
  // Open automatically in Chrome / Default Browser (Local only)
  if (process.env.NODE_ENV !== 'production') {
    const startCmd = process.platform === 'win32' ? 'start' : process.platform === 'darwin' ? 'open' : 'xdg-open';
    exec(`${startCmd} http://localhost:${PORT}`);
  }
});

module.exports = app;
