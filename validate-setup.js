#!/usr/bin/env node

// Quick validation script for GitHub LFS setup
const fs = require('fs');
const path = require('path');

console.log('🔍 GitHub LFS + GitHub Pages Setup Validation\n');

const checkFile = (filePath, description) => {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${description}`);
    return true;
  } else {
    console.log(`❌ ${description} - Missing: ${filePath}`);
    return false;
  }
};

let allGood = true;

// Check required files
allGood &= checkFile('.gitattributes', 'Git LFS configuration');
allGood &= checkFile('.github/workflows/deploy.yml', 'GitHub Actions deployment');
allGood &= checkFile('src/lib/github.ts', 'GitHub API integration');
allGood &= checkFile('src/lib/storage.ts', 'Storage abstraction layer');
allGood &= checkFile('DEPLOY_GITHUB.md', 'GitHub deployment guide');
allGood &= checkFile('.env.example', 'Environment variables template');

// Check package.json scripts
try {
  const pkg = require('./package.json');
  if (pkg.scripts.build && pkg.scripts.dev) {
    console.log('✅ Build scripts configured');
  } else {
    console.log('❌ Build scripts missing');
    allGood = false;
  }
} catch (e) {
  console.log('❌ package.json issues');
  allGood = false;
}

// Check if Git LFS is installed (optional)
try {
  const { execSync } = require('child_process');
  execSync('git lfs version', { stdio: 'ignore' });
  console.log('✅ Git LFS is installed');
} catch (e) {
  console.log('⚠️  Git LFS not installed - run: git lfs install');
}

console.log('\n📋 Next Steps:');
console.log('1. Install Git LFS: git lfs install');
console.log('2. Create GitHub repository (can be private)');
console.log('3. Generate GitHub Personal Access Token');
console.log('4. Copy .env.example to .env and configure');
console.log('5. Follow DEPLOY_GITHUB.md for complete setup');

if (allGood) {
  console.log('\n🎉 Setup is complete and ready for deployment!');
} else {
  console.log('\n⚠️  Some files are missing. Please check the setup.');
}

console.log('\n🌐 After deployment, your app will be at:');
console.log('https://YOUR_USERNAME.github.io/fileupload/');