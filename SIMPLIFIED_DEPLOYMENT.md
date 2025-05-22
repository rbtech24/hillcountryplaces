# Simplified SiteGround Deployment Guide

This guide provides a more straightforward approach to deploy your Texas Hill Country website to SiteGround.

## Core Steps

### 1. Prepare Your Files - Precompile TypeScript

1. On your local machine or in Replit, open the shell and run:
   ```
   # First, build the frontend
   npm run build
   
   # Then compile TypeScript server code using the production config
   npx tsc --project tsconfig.production.json
   ```
   
   These commands will:
   - Create a `dist` folder with your optimized frontend code
   - Compile your TypeScript server code to JavaScript
   
   Using precompiled JavaScript on your production server is much more efficient than running TypeScript directly.

2. Gather these essential folders/files for your deployment package:
   - `dist` folder (contains your built application)
   - `server` folder (contains your backend code)
   - `shared` folder (contains shared schemas and types)
   - `public` folder (static assets)
   - `package.json` 
   - `package-lock.json`
   - Create a `.env` file with your environment variables:
     ```
     DATABASE_URL=your-database-connection-string
     GOOGLE_CALENDAR_API_KEY=your-google-api-key
     OPENAI_API_KEY=your-openai-api-key
     WEATHER_API_KEY=your-weather-api-key
     NODE_ENV=production
     PORT=8080  # This will be overridden by SiteGround
     ```

### 2. Download Files from Replit

1. In Replit, you can download your project as a ZIP file:
   - Click on the three dots (...) in the files panel
   - Select "Download as zip"
   - This will download all project files to your computer

2. Extract the ZIP file on your computer
   - Delete any unnecessary files (like `node_modules` folder) to reduce size
   - Make sure all the essential files listed above are included

### 3. Upload to SiteGround

1. Log in to your SiteGround account
2. Navigate to your cPanel or Site Tools
3. Use the File Manager or FTP to upload your files to the public_html directory
   - You can upload the entire folder structure
   - Or upload a ZIP file and extract it on the server

### 4. Set Up Node.js

1. In SiteGround's control panel, go to "Devs" > "Node.js"
2. Enable Node.js and select the latest version (Node.js 18 or higher)
3. Set your entry point to `server/index.js`
4. Note the port number SiteGround assigns (you'll need it later)

### 5. Install Dependencies

1. Connect to your site using SSH:
   - Find SSH access credentials in your SiteGround dashboard
   - Use an SSH client like PuTTY (Windows) or Terminal (Mac/Linux)
   - The command will look like: `ssh username@servername`

2. Navigate to your site directory:
   ```
   cd ~/public_html
   ```

3. Install dependencies:
   ```
   npm install
   ```

### 6. Start Your Application

1. While still connected via SSH, install PM2 (process manager):
   ```
   npm install -g pm2
   ```

2. Start your application using the compiled JavaScript file:
   ```
   pm2 start dist/server/index.js --name hill-country
   pm2 save
   ```

3. Make your application start automatically if the server restarts:
   ```
   pm2 startup
   ```
   Then run the command PM2 provides

### 7. Set Up URL Routing

1. Create an `.htaccess` file in your main website directory with:
   ```
   RewriteEngine On
   RewriteRule ^(.*)$ http://localhost:YOUR_PORT/$1 [P,L]
   ```
   Replace YOUR_PORT with the port number SiteGround assigned to you in Step 4

2. If the .htaccess file already exists, add these lines to it rather than creating a new file

## 8. Set Up Database

1. In SiteGround's control panel, go to "Site Tools" > "Database" > "PostgreSQL"
2. Create a new database
3. Create a database user and grant permissions
4. Update your `.env` file with the database connection details

5. Run your database migrations from SSH:
   ```
   cd ~/public_html
   node ./node_modules/drizzle-kit/bin.js push:pg
   ```

## 9. For Images to Persist

1. After initial setup, create a persistent uploads folder:
   ```
   mkdir -p ~/public_html/persistent_uploads
   chmod 755 ~/public_html/persistent_uploads
   ```

2. Create a symbolic link:
   ```
   cd ~/public_html/public
   ln -s ~/public_html/persistent_uploads uploads
   ```

## 10. Verify Your Website

1. Visit your domain in a web browser
2. Check that all pages load correctly
3. Test the admin login functionality at `/admin/login`
4. Try uploading an image through the admin interface
5. Verify that all features are working properly

## Need Help?

SiteGround offers excellent customer support that can help with deployment:

1. Contact their 24/7 support team via chat or phone
2. Request assistance with your Node.js application deployment
3. They can guide you through the process or even help set it up directly

Many SiteGround hosting plans include technical support for application setup, so don't hesitate to use this valuable resource!