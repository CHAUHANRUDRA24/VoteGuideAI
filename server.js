require('dotenv').config();
const express = require('express');
const { createServer: createViteServer } = require('vite');
const path = require('path');
const app = require('./server/app');
const aiService = require('./server/services/aiService');

const PORT = process.env.PORT || 3000;

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 VotePath AI Server running on port ${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    
    // Check AI availability on startup
    aiService.getStatus().then(status => {
      console.log('🤖 AI Status:');
      console.log(`   Gemini: ${status.gemini ? '🟢 Available' : '🔴 Unavailable'}`);
      console.log(`   Local: ${status.local || '🔴 Unavailable'}\n`);
    }).catch(err => {
      console.log('Error checking AI status:', err.message);
    });
  });

  server.on('error', (err) => {
    console.error('❌ Server error:', err);
    process.exit(1);
  });
}

startServer();
