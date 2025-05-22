# Image Persistence Guide for SiteGround Hosting

This guide explains how to ensure uploaded images persist between deployments when hosting your Texas Hill Country website on SiteGround.

## Understanding the Issue

When you upload images through the admin interface, they are stored in the `/public/uploads` directory on the server. On Replit deployments, this directory is temporary and gets reset when you redeploy. However, on SiteGround, we can configure things properly to maintain these uploads.

## Solution for SiteGround Hosting

### 1. Create a Persistent Uploads Directory

During initial deployment:

1. Connect to your SiteGround server using FTP or SSH
2. Navigate to your website's root directory
3. Create a dedicated `uploads` folder that won't be overwritten during deployments:
   ```
   mkdir -p ~/www/your-domain.com/persistent_uploads
   ```
4. Set proper permissions:
   ```
   chmod 755 ~/www/your-domain.com/persistent_uploads
   ```

### 2. Symbolic Link Setup

Create a symbolic link from your application's uploads directory to the persistent directory:

```bash
# Connect via SSH to your SiteGround server
cd ~/www/your-domain.com/your-app-directory/public
ln -s ~/www/your-domain.com/persistent_uploads uploads
```

This creates a symbolic link named "uploads" in your public directory that points to the persistent directory.

### 3. Deployment Strategy

When deploying updates to your website:

1. **IMPORTANT**: Do not delete or overwrite the `persistent_uploads` directory
2. If you're uploading a new version of the site:
   - Delete the old application files except for the symbolic link
   - Upload the new files
   - Verify the symbolic link is still intact

### 4. Alternative: Update Upload Configuration

If the symbolic link approach doesn't work for your setup, you can modify the application code to store uploads in a separate persistent directory:

1. Edit the `server/upload.ts` file to change the uploads directory path:

```typescript
// Modify this line in server/upload.ts
const uploadsDir = path.join(__dirname, "..", "..", "persistent_uploads");
```

2. Update your application to serve files from this directory:

```typescript
// Add this to server/index.ts
app.use('/uploads', express.static(path.join(__dirname, "..", "persistent_uploads")));
```

## Backup Strategy

Even with this setup, regularly back up your uploads directory:

1. Go to SiteGround's "Site Tools" > "Security" > "Backups"
2. Configure daily or weekly backups
3. Alternatively, download the contents of the `persistent_uploads` directory periodically as a manual backup

## Verifying the Setup

After deployment:
1. Login to the admin interface
2. Upload a test image
3. Verify the image is stored in the persistent directory
4. Perform a small update to your site and redeploy
5. Verify the previously uploaded image is still accessible

By following these steps, your uploaded images will remain available even after redeploying your website on SiteGround hosting.