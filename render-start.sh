#!/bin/bash
# Start script for Render deployment

# Set NODE_ENV if not already set
export NODE_ENV=production

# Start the application
node dist/server/index.js