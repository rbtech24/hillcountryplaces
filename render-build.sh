#!/bin/bash
# Build script for Render deployment

# Install dependencies
npm install

# Build frontend (Vite)
npm run build

# Compile TypeScript for backend
npx tsc --project tsconfig.production.json

# Copy package.json to dist folder for proper Node module resolution
cp package.json dist/

echo "Build completed successfully!"