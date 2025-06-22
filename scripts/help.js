console.log(`
========================================
   📊 FEED - Available Commands
========================================

🚀 STARTUP COMMANDS:
   npm run start-clean    Clean port kill + start (RECOMMENDED)
   npm start              Kill all Node + start  
   npm run dev            Alias for start-clean

🔧 SERVICE MANAGEMENT:
   npm run server         Start server only
   npm run client         Start client only
   npm run kill           Kill all Node.js processes
   npm run kill-ports     Kill processes on ports 3000,5000,8080
   npm run check-ports    Check port availability

📊 DATABASE:
   npm run populate       Populate MongoDB with 155 mock tokens
   npm run seed           Legacy database seed

🛠️  DEVELOPMENT:
   npm run setup          Install all dependencies
   npm run build          Build client for production
   npm run help           Show this help

========================================
   🌐 Access Points
========================================

   Frontend:    http://localhost:3000
   API:         http://localhost:5000  
   Health:      http://localhost:5000/health
   WebSocket:   ws://localhost:8080

========================================
   💡 Recommended Workflow
========================================

   1. npm run check-ports     (Check what's running)
   2. npm run start-clean     (Clean start)
   3. npm run populate        (Fresh data if needed)

========================================
`); 