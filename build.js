// Direct build script for Render deployment
import { execSync } from 'child_process';

console.log('📦 Starting custom build process...');

try {
  // Install dependencies if needed
  console.log('📥 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Install vite locally
  console.log('📥 Installing Vite...');
  execSync('npm install --save-dev vite', { stdio: 'inherit' });

  // Install esbuild locally
  console.log('📥 Installing esbuild...');
  execSync('npm install --save-dev esbuild', { stdio: 'inherit' });
  
  // Build frontend
  console.log('🔨 Building frontend...');
  execSync('node ./node_modules/vite/bin/vite.js build', { stdio: 'inherit' });
  
  // Build backend
  console.log('🔨 Building backend...');
  execSync('node ./node_modules/esbuild/bin/esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit' });
  
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}