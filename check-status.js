#!/usr/bin/env node

const http = require('http');
const https = require('https');

const checkService = (url, name) => {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, (res) => {
      console.log(`✅ ${name} is running (Status: ${res.statusCode})`);
      resolve(true);
    });
    
    req.on('error', (err) => {
      console.log(`❌ ${name} is not running (${err.message})`);
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      console.log(`⏰ ${name} request timed out`);
      req.destroy();
      resolve(false);
    });
  });
};

const main = async () => {
  console.log('🔍 Checking application status...\n');
  
  const frontendRunning = await checkService('http://localhost:3001', 'Frontend (React)');
  const backendRunning = await checkService('http://localhost:3000', 'Backend (Node.js)');
  
  console.log('\n📊 Summary:');
  if (frontendRunning && backendRunning) {
    console.log('🎉 Both services are running!');
    console.log('🌐 Open http://localhost:3001 in your browser');
  } else if (frontendRunning) {
    console.log('⚠️  Only frontend is running (AI features may not work)');
    console.log('🌐 Open http://localhost:3001 in your browser');
  } else if (backendRunning) {
    console.log('⚠️  Only backend is running');
    console.log('💡 Start frontend with: npm run start:frontend');
  } else {
    console.log('❌ No services are running');
    console.log('💡 Start the application with: npm start');
  }
  
  console.log('\n🔧 Troubleshooting:');
  console.log('- If services are not running, try: npm start');
  console.log('- If you see errors, check the console output');
  console.log('- Make sure ports 3000 and 3001 are not in use');
  console.log('- Check that all dependencies are installed: npm run install:all');
};

main().catch(console.error); 