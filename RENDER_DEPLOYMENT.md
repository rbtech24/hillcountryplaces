# Texas Hill Country Website Deployment Guide for Render.com

This guide will walk you through deploying your Texas Hill Country website on Render.com.

## Prerequisites

- A Render.com account (create one at https://render.com)
- Your project code in a Git repository (GitHub, GitLab, or Bitbucket)
- Your API keys for Google Calendar, OpenAI, and Weather API

## Step 1: Prepare Your Project

1. Make sure your project has a `package.json` file with these scripts:
   ```json
   "scripts": {
     "build": "npm run build:client",
     "build:client": "vite build",
     "start": "node dist/server/index.js"
   }
   ```

2. Create a `.env.sample` file with all required environment variables (without actual values)

3. Ensure your `server/index.ts` properly uses process.env.PORT with a fallback:
   ```typescript
   const port = process.env.PORT || 5000;
   ```

## Step 2: Set Up Render Database

1. Log in to your Render.com account
2. Navigate to the Dashboard
3. Click "New" and select "PostgreSQL"
4. Configure your database:
   - Name: `hill-country-db` (or your preferred name)
   - Database: `hillcountry`
   - User: Leave as default
   - Region: Choose closest to your users
   - Select appropriate plan (Free plan works for development)
5. Click "Create Database"
6. Once created, note your connection details:
   - Internal Database URL
   - External Database URL
   - Username, password, and other connection details

## Step 3: Deploy Your Web Service

1. From your Render dashboard, click "New" and select "Web Service"
2. Connect your GitHub/GitLab/Bitbucket repository
3. Configure the web service:
   - Name: `texas-hill-country` (or your preferred name)
   - Runtime: Node
   - Build Command: `npm install && npm run build && npx tsc --project tsconfig.production.json`
   - Start Command: `npm start`
   - Select appropriate plan (Starter plan works for small to medium sites)

4. Add environment variables:
   - Click "Environment" section
   - Add all required environment variables:
     - DATABASE_URL (use the Internal Database URL from Step 2)
     - GOOGLE_CALENDAR_API_KEY
     - OPENAI_API_KEY
     - WEATHER_API_KEY
     - NODE_ENV=production
     - SESSION_SECRET (generate a random string)
     - TINYMCE_API_KEY

5. Click "Create Web Service"

## Step 4: Set Up Persistent Storage for Uploads

Render does not have persistent file storage on free/starter plans, so we need to modify the app to use Render's disk or an external storage service.

### Option 1: Use Render Disk (paid plans only)

If you're on a paid plan, Render provides persistent disk storage:

1. Go to your web service dashboard
2. Click "Disks" in the left menu
3. Create a new disk:
   - Mount Path: `/data/uploads`
   - Size: Select an appropriate size (min 1 GB)
4. Click "Create"

5. Update your code to use this path:
```typescript
// In server/upload.ts
const uploadsDir = process.env.NODE_ENV === 'production' 
  ? '/data/uploads' 
  : path.join(__dirname, "..", "public", "uploads");
```

```typescript
// In server/index.ts (add)
app.use('/uploads', express.static('/data/uploads'));
```

### Option 2: Use External Storage like AWS S3 (recommended)

For a more robust solution, especially on free plans, use AWS S3 or similar:

1. Create an AWS S3 bucket
2. Add AWS credentials to your Render environment variables:
   - AWS_ACCESS_KEY_ID
   - AWS_SECRET_ACCESS_KEY
   - AWS_BUCKET_NAME
   - AWS_REGION

## Step 5: Database Migration

After deployment, you'll need to run your database migrations:

1. Go to your Web Service dashboard on Render
2. Click "Shell" to access the terminal
3. Run migrations:
   ```bash
   node ./node_modules/drizzle-kit/bin.js push:pg
   ```

## Step 6: Verify Your Deployment

1. Click the generated URL for your web service (something like `https://texas-hill-country.onrender.com`)
2. Verify your application loads correctly
3. Test all functionality:
   - Check the admin login
   - Test image uploads
   - Verify API integrations
   - Test database operations

## Troubleshooting

- **Application crashes**: Check logs in the Render dashboard
- **Database connection issues**: Verify DATABASE_URL is correctly set
- **Image upload failures**: Ensure storage configuration is correct
- **Slow initial load**: This is normal, as free/starter services spin down when inactive

## Maintaining Your Site

1. **Updates**:
   - Push changes to your connected repository
   - Render automatically rebuilds and deploys

2. **Monitoring**:
   - Use Render's built-in logs and metrics
   - Set up monitoring alerts for downtime

3. **Database Backups**:
   - Render automatically takes daily backups of your database
   - You can also manually create backups from the database dashboard