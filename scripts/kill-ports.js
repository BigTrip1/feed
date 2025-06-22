const { exec } = require('child_process');

const ports = [3000, 5000, 8080];
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m'
};

console.log('\n🔄 Killing processes on FEED ports...\n');

async function killPort(port) {
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
                    let killedCount = 0;
                    
                    uniquePids.forEach(pid => {
                        exec(`taskkill /f /pid ${pid}`, { windowsHide: true }, (killError) => {
                            if (!killError) killedCount++;
                        });
                    });
                    
                    setTimeout(() => {
                        if (killedCount > 0) {
                            console.log(`Port ${port}: ${colors.green}✅ KILLED${colors.reset} (${killedCount} process${killedCount > 1 ? 'es' : ''})`);
                        } else {
                            console.log(`Port ${port}: ${colors.yellow}⚠️  FAILED TO KILL${colors.reset}`);
                        }
                        resolve();
                    }, 500);
                } else {
                    console.log(`Port ${port}: ${colors.cyan}ℹ️  NO PROCESSES${colors.reset}`);
                    resolve();
                }
            } else {
                console.log(`Port ${port}: ${colors.cyan}✅ FREE${colors.reset}`);
                resolve();
            }
        });
    });
}

async function main() {
    await Promise.all(ports.map(killPort));
    console.log(`\n${colors.green}🎯 Port cleanup complete!${colors.reset}\n`);
}

main(); 