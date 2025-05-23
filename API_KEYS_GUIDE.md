# API Keys Guide for Render Deployment

When deploying your Texas Hill Country website to Render, you'll need to add these API keys as environment variables in your Render dashboard.

## Required API Keys

### 1. Google Calendar API Key
You have this key stored in your Replit secrets. This key allows your application to integrate with Google Calendar for events. You can find this key in your Google Cloud Console.

### 2. OpenAI API Key
This powers your AI travel assistant feature. You can get this key from your OpenAI account dashboard.

### 3. Weather API Key
Value: 63049bf3e5e34e12b5f132415252105
This powers your weather widget from WeatherAPI.com.

## Setting Up in Render

1. Log into your Render dashboard
2. Go to your web service
3. Click "Environment" in the left sidebar
4. Add each API key with its corresponding variable name:
   - GOOGLE_CALENDAR_API_KEY
   - OPENAI_API_KEY
   - WEATHER_API_KEY

## If You Need New API Keys

### Google Calendar API
1. Go to https://console.cloud.google.com/
2. Create a project if you don't have one
3. Enable the Google Calendar API
4. Create credentials for API key
5. Restrict the key to Google Calendar API only

### OpenAI API
1. Go to https://platform.openai.com/
2. Create an account or log in
3. Navigate to API keys section
4. Create a new secret key

### Weather API
1. Go to https://www.weatherapi.com/
2. Create an account or log in
3. Navigate to your dashboard
4. Copy your API key

Remember to keep your API keys secure and never share them publicly!