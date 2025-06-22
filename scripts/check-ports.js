const { exec } = require('child_process');

const ports = [3000, 5000, 8080];
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    reset: '\x1b[0m'
};

console.log('\n🔍 Checking FEED ports...\n');

async function checkPort(port) {
    return new Promise((resolve) => {
        exec(`netstat -ano | findstr :${port}`, (error, stdout) => {
            const isInUse = stdout.trim().length > 0;
            const status = isInUse ? 'IN USE' : 'FREE';
            const color = isInUse ? colors.red : colors.green;
            
            console.log(`Port ${port}: ${color}${status}${colors.reset}`);
            resolve({ port, inUse: isInUse });
        });
    });
}

async function main() {
    const results = await Promise.all(ports.map(checkPort));
    const inUse = results.filter(r => r.inUse);
    
    if (inUse.length > 0) {
        console.log(`\n${colors.yellow}⚠️  ${inUse.length} port(s) in use. Run 'npm run kill' to free them.${colors.reset}`);
    } else {
        console.log(`\n${colors.green}✅ All ports are free!${colors.reset}`);
    }
}

main(); 