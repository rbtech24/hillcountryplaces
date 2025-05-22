#!/bin/bash
set -e

# Install dependencies
npm install

# Install Vite and ESBuild globally
npm install -g vite esbuild

# Build frontend
echo "Building frontend..."
./node_modules/.bin/vite build

# Build backend
echo "Building backend..."
./node_modules/.bin/esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

echo "Build completed successfully!"