const { spawn, exec } = require('child_process');
const path = require('path');

console.log('\n========================================');
console.log('   🚀 FEED - Clean Startup Script');
console.log('========================================\n');

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    red: '\x1b[31m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function killPortProcesses() {
    log('🔄 Killing processes on ports 3000, 5000, 8080...', 'yellow');
    
    const ports = [3000, 5000, 8080];
    const killPromises = ports.map(port => {
        return new Promise((resolve) => {
            exec(`netstat -ano | findstr :${port}`, (error, stdout) => {
                if (stdout.trim()) {
                    const lines = stdout.trim().split('\n');
                    const pids = lines.map(line => {
                        const parts = line.trim().split(/\s+/);
                        return parts[parts.length - 1];
                    }).filter(pid => pid && pid !== '0');
                    
                    if (pids.length > 0) {
                        const uniquePids = [...new Set(pids)];
                        uniquePids.forEach(pid => {
                            exec(`taskkill /f /pid ${pid}`, { windowsHide: true }, () => {});
                        });
                        log(`   ✅ Killed processes on port ${port}`, 'green');
                    }
                } else {
                    log(`   ✅ Port ${port} is free`, 'cyan');
                }
                resolve();
            });
        });
    });
    
    await Promise.all(killPromises);
}

async function startServices() {
    log('\n📊 Starting FEED Server and Client...', 'blue');
    
    // Start both services using concurrently
    const concurrentProcess = spawn('npx', [
        'concurrently',
        '"cd server && node index.js"',
        '"cd client && npm start"',
        '--names', 'SERVER,CLIENT',
        '--prefix-colors', 'blue,green',
        '--kill-others-on-fail'
    ], {
        stdio: 'inherit',
        shell: true
    });

    // Handle graceful shutdown
    process.on('SIGINT', () => {
        log('\n🛑 Shutting down FEED services...', 'red');
        concurrentProcess.kill('SIGINT');
        setTimeout(() => process.exit(0), 1000);
    });

    concurrentProcess.on('close', (code) => {
        if (code !== 0) {
            log(`\n❌ Process exited with code ${code}`, 'red');
        }
        process.exit(code || 0);
    });

    // Display startup info after a delay
    setTimeout(() => {
        log('\n✅ FEED services are starting!', 'green');
        log('🌐 Frontend: http://localhost:3000', 'cyan');
        log('🔗 API:      http://localhost:5000', 'blue');
        log('📡 WebSocket: ws://localhost:8080', 'yellow');
        log('💡 Press Ctrl+C to stop all services\n', 'yellow');
    }, 3000);
}

async function main() {
    try {
        // Step 1: Kill processes on target ports
        await killPortProcesses();
        
        // Step 2: Wait a moment for ports to be freed
        await sleep(2000);
        
        // Step 3: Start services
        await startServices();
        
    } catch (error) {
        log(`❌ Error starting FEED: ${error.message}`, 'red');
        process.exit(1);
    }
}

main(); 