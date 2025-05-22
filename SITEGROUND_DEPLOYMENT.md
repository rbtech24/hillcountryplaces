# SiteGround Deployment Guide for Texas Hill Country Website

This guide will walk you through the process of deploying your Texas Hill Country website on SiteGround hosting.

## Prerequisites

- SiteGround hosting account (GrowBig or GoGeek plan recommended for Node.js apps)
- Domain name configured to point to your SiteGround hosting
- FTP client or SSH access

## Step 1: Prepare Your Project for Production

### 1.1 Build the Project for Production

Before uploading your files, compile the project for production:

```bash
# Make sure you're in your project root directory
npm install
npm run build
```

This will create optimized production files in the `dist` directory.

### 1.2 Update Environment Variables

Create a `.env` file with your production environment variables:

```
DATABASE_URL=your-production-database-url
GOOGLE_CALENDAR_API_KEY=your-google-api-key
OPENAI_API_KEY=your-openai-api-key
NODE_ENV=production
PORT=8080  # Or another port supported by SiteGround
```

## Step 2: Set Up SiteGround Hosting

### 2.1 Log in to SiteGround Control Panel

- Log in to your SiteGround Client Area
- Navigate to "Websites" > Select your domain

### 2.2 Enable Node.js on Your Account

1. Go to "Site Tools" > "Devs" > "Node.js"
2. Click "Enable Node.js"
3. Select the latest stable Node.js version (v18 or higher recommended)
4. Note the assigned port number for your Node.js application

### 2.3 Create a PostgreSQL Database

1. Go to "Site Tools" > "Database" > "PostgreSQL"
2. Create a new database
3. Create a new user with full privileges for that database
4. Note the database credentials (hostname, database name, username, password)
5. Update your `.env` file with these database credentials

## Step 3: Upload Your Files

### 3.1 Using FTP

1. Connect to your SiteGround server using FTP:
   - Host: Your SiteGround server address (usually looks like 'nl.siteground.eu')
   - Username: Your SiteGround username
   - Password: Your SiteGround password
   - Port: 21 (standard FTP port)

2. Navigate to your domain's public_html folder or create a dedicated folder for your application

3. Upload the following directories and files:
   - `dist` directory (contains your built application)
   - `server` directory
   - `shared` directory
   - `package.json`
   - `package-lock.json`
   - `.env` file (with your production credentials)
   - Any other necessary configuration files

### 3.2 Using SSH (Alternative)

If you're comfortable with command line:

1. Connect to your SiteGround server using SSH:
   ```bash
   ssh username@your-domain.com
   ```

2. Navigate to or create your application directory:
   ```bash
   cd ~/www/your-domain.com
   ```

3. Clone your GitHub repository (if you've pushed your code there):
   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

4. Install dependencies and build:
   ```bash
   npm install
   npm run build
   ```

## Step 4: Configure Your Application as a Service

### 4.1 Install PM2 (Process Manager)

PM2 will ensure your Node.js app runs continuously:

```bash
# Connect via SSH
npm install -g pm2
```

### 4.2 Create PM2 Configuration

Create a file called `ecosystem.config.js` in your project root:

```javascript
module.exports = {
  apps: [{
    name: "hill-country-website",
    script: "server/index.js",
    instances: 1,
    env: {
      NODE_ENV: "production",
      PORT: 8080  // Use the port assigned by SiteGround
    }
  }]
};
```

### 4.3 Start Your Application

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Step 5: Configure Database and Run Migrations

If you uploaded your application via FTP and need to set up the database:

```bash
# Connect via SSH
cd ~/www/your-domain.com/your-app-directory
npm run db:push
```

## Step 6: Set Up Domain Routing

### 6.1 Configure .htaccess for Reverse Proxy

Create or edit the `.htaccess` file in your domain's root directory:

```apache
RewriteEngine On
RewriteRule ^(.*)$ http://localhost:8080/$1 [P,L]
```

Replace `8080` with the port number assigned by SiteGround for your Node.js application.

### 6.2 Configure SSL

1. Go to "Site Tools" > "Security" > "SSL Manager"
2. Enable Let's Encrypt SSL certificate for your domain
3. Ensure "HTTPS Enforce" is enabled

## Step 7: Post-Deployment Tasks

### 7.1 Verify Your Application

- Visit your domain in a web browser
- Check if all pages load correctly
- Test the admin login at `/admin/login`
- Verify database connectivity
- Test the Google Calendar integration
- Check if the travel assistant is working

### 7.2 Set Up Monitoring

1. Go to "Site Tools" > "Statistics" > "Visitors"
2. Enable visitor statistics to monitor traffic

### 7.3 Set Up Backups

1. Go to "Site Tools" > "Security" > "Backups"
2. Configure daily/weekly backups of your website and database

## Troubleshooting

### Application Won't Start

- Check SiteGround logs: "Site Tools" > "Logs" > "Error Log"
- Check Node.js application logs via SSH:
  ```bash
  pm2 logs
  ```

### Database Connection Issues

- Verify database credentials in your `.env` file
- Check if the database server is running:
  ```bash
  psql -h localhost -U your_username -d your_database
  ```

### 502 Bad Gateway Errors

- Check if your Node.js application is running:
  ```bash
  pm2 list
  ```
- Check if the port number in your `.htaccess` file matches the one assigned by SiteGround

## Updating Your Website

When you need to update your website:

1. Upload the new files to your server
2. Connect via SSH 
3. Restart your application:
   ```bash
   pm2 restart hill-country-website
   ```

## Additional Resources

- [SiteGround Node.js Documentation](https://www.siteground.com/tutorials/nodejs/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)