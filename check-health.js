#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking project health...\n');

// Check if node_modules exists
const nodeModulesPath = path.join(process.cwd(), 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('❌ node_modules not found');
  console.log('📋 Run: npm install\n');
} else {
  console.log('✅ node_modules found');
}

// Check if .env exists
const envPath = path.join(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.log('⚠️  .env file not found');
  console.log('📋 Copy .env.example to .env and fill in your values\n');
} else {
  console.log('✅ .env file found');
}

// Check package.json
try {
  const pkg = require(path.join(process.cwd(), 'package.json'));
  console.log('✅ package.json is valid');
  console.log(`📦 Project: ${pkg.name}`);
  console.log(`🔧 Scripts available: ${Object.keys(pkg.scripts).join(', ')}\n`);
} catch (e) {
  console.log('❌ package.json has issues');
}

console.log('🚀 To start development:');
console.log('1. npm install');
console.log('2. Copy .env.example to .env');
console.log('3. Fill in your Supabase credentials');
console.log('4. npm run dev');