#!/bin/bash
# Build script for Render deployment

# Install dependencies
npm install

# Install Vite globally (needed for the build)
npm install -g vite

# Build frontend with Vite explicitly
npx vite build

# Use esbuild for the server
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

# Copy package.json to dist folder for proper Node module resolution
cp package.json dist/

echo "Build completed successfully!"