# Setting Up Cloudinary for Persistent Image Storage

This guide explains how to set up Cloudinary for persistent image storage with your Texas Hill Country website on Render.

## Why Cloudinary?

When you deploy to Render, any images uploaded through the admin interface are stored on the server's temporary filesystem. These files get lost whenever:
- You redeploy your application
- Render restarts your service
- You update your code

Cloudinary solves this by storing your images in the cloud, making them permanently available even when your server restarts or redeploys.

## Step 1: Create a Cloudinary Account

1. Go to [Cloudinary.com](https://cloudinary.com/) and sign up for a free account
2. After signing up, go to your Dashboard
3. Find your account details including:
   - Cloud Name
   - API Key
   - API Secret

## Step 2: Add Cloudinary Environment Variables to Render

1. In your Render dashboard, go to your Web Service
2. Click on "Environment" in the left sidebar
3. Add these environment variables:
   - `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY` - Your Cloudinary API key
   - `CLOUDINARY_API_SECRET` - Your Cloudinary API secret

## Step 3: Deploy Your Application

1. After adding the environment variables, click "Save Changes"
2. Redeploy your application by clicking "Manual Deploy" > "Deploy latest commit"

## Step 4: Test Image Uploads

1. Log in to your admin dashboard
2. Try uploading a new image
3. The image should now be stored on Cloudinary instead of the local server

## How It Works

When you upload an image:
1. The image is temporarily stored on the server
2. It's then uploaded to your Cloudinary account
3. The Cloudinary URL is stored in your database
4. The temporary file on the server is deleted

This ensures your images persist between deployments and server restarts.

## Troubleshooting

If images aren't being uploaded to Cloudinary:
1. Check your environment variables are correctly set
2. Look at the server logs for any Cloudinary-related errors
3. Ensure your Cloudinary account is active

If you need to rebuild your site with all images, you'll need to manually upload them again or restore from a database backup.