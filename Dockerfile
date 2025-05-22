FROM node:18

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Install build tools
RUN npm install -g vite esbuild

# Copy source code
COPY . .

# Build the application
RUN vite build
RUN esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

# Expose the port
EXPOSE 8080

# Set environment variables
ENV NODE_ENV=production

# Start the application
CMD ["node", "dist/index.js"]