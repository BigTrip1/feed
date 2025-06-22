#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting FEED Development Environment...\n');

// Start MongoDB (assumes local installation)
console.log('📊 Starting MongoDB...');
const mongoProcess = spawn('mongod', [], {
  stdio: 'pipe',
  shell: true
});

mongoProcess.stdout.on('data', (data) => {
  if (data.toString().includes('waiting for connections')) {
    console.log('✅ MongoDB is ready\n');
    startApplications();
  }
});

mongoProcess.stderr.on('data', (data) => {
  console.log('MongoDB:', data.toString());
});

function startApplications() {
  // Start backend server
  console.log('🖥️  Starting Backend Server...');
  const serverProcess = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, '../server'),
    stdio: 'inherit',
    shell: true
  });

  // Wait a moment then start frontend
  setTimeout(() => {
    console.log('🌐 Starting React Frontend...');
    const clientProcess = spawn('npm', ['start'], {
      cwd: path.join(__dirname, '../client'),
      stdio: 'inherit',
      shell: true
    });

    // Handle process cleanup
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down development environment...');
      serverProcess.kill();
      clientProcess.kill();
      mongoProcess.kill();
      process.exit(0);
    });
  }, 3000);
}

// If MongoDB is already running, start applications immediately
setTimeout(() => {
  console.log('⚡ MongoDB may already be running, starting applications...');
  startApplications();
}, 5000); 