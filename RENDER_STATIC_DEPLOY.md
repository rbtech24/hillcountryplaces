# Static Build Deployment to Render

Since you're running into build issues with Vite on Render, here's an alternative approach to deploy your site:

## Step 1: Build Locally

1. Build the project completely on your local machine:

```bash
# Build frontend (Vite)
npm run build

# Build backend (TypeScript)
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist
```

## Step 2: Create a Static Site on Render

1. Log in to Render
2. Click on "New" and select "Static Site"
3. Configure the static site:
   - Name: `hill-country-static`
   - Build Command: Leave empty (we'll upload pre-built files)
   - Publish Directory: `dist/public`
   - Select a branch from your repo or "Deploy from local files"

## Step 3: Create a Web Service for the Backend

1. Click on "New" and select "Web Service" 
2. Connect your GitHub repository
3. Configure the service:
   - Name: `hill-country-api`
   - Runtime: Node
   - Build Command: `echo "Using pre-built files"`
   - Start Command: `node dist/index.js`
   - Select the appropriate plan

4. Add environment variables:
   - DATABASE_URL
   - GOOGLE_CALENDAR_API_KEY
   - OPENAI_API_KEY
   - WEATHER_API_KEY
   - NODE_ENV=production
   - SESSION_SECRET

5. Advanced options: Set "Public" to false (since it's just the API)

## Step 4: Upload Pre-built Files

For the static site and web service:
1. Go to the "Manual Deploy" tab
2. Select "Upload files"
3. Upload your pre-built files
   - For static site: Upload contents of `dist/public`
   - For web service: Upload `dist` folder and `package.json`

## Alternative: Deploy to GitHub Pages or Netlify

Since you're having persistent issues with Render, consider:

1. GitHub Pages (static frontend only):
   - Create a repository
   - Build locally
   - Push the `dist/public` folder to a gh-pages branch

2. Netlify (full site):
   - Sign up for Netlify
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist/public`

## Using Your Own Server (You mentioned this works)

If you have your own server where the site is already working, that's often the best option:

1. Set up a Node.js environment
2. Install PM2 for process management
3. Configure Nginx as a reverse proxy
4. Set up SSL with Let's Encrypt

Let me know if you'd like detailed instructions for any of these alternative approaches!