# YouTube Video Downloader - Complete Setup Guide

This extension provides a one-click experience to download YouTube videos with quality selection using a backend server.

## 🏗️ Architecture

- **Chrome Extension**: Provides the UI and handles downloads
- **Backend Server**: Uses `yt-dlp` to fetch real download URLs
- **yt-dlp**: The actual tool that extracts video information

## 📋 Prerequisites

1. **Node.js** (v14 or higher)
2. **yt-dlp** (installed via pip or brew)

## 🚀 Installation Steps

### Step 1: Install yt-dlp

**On macOS:**
```bash
brew install yt-dlp
```

**On Linux/Windows:**
```bash
pip install yt-dlp
```

### Step 2: Start the Backend Server

```bash
cd backend
npm install
npm start
```

You should see:
```
Downloader backend listening on :4000
Make sure yt-dlp is installed: pip install yt-dlp or brew install yt-dlp
```

**Keep this terminal open** - the server needs to stay running.

### Step 3: Install Chrome Extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the main extension folder (containing `manifest.json`)

### Step 4: Test the Extension

1. Go to any YouTube video (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)
2. Click the extension icon in the toolbar
3. You should see:
   - Real video title
   - Multiple quality options with file sizes
   - Download button

## 🎯 How It Works

1. **User clicks extension** → Popup opens
2. **Extension extracts video ID** → From current YouTube URL
3. **Popup calls backend** → `POST /getDownload` with video ID
4. **Backend calls yt-dlp** → Gets all available formats with real URLs
5. **User selects quality** → Chooses from available options
6. **Chrome downloads file** → Using the real URL from yt-dlp

## 🔧 Troubleshooting

### Backend Issues
- **"yt-dlp not found"**: Install yt-dlp using pip or brew
- **"Failed to connect"**: Make sure backend server is running on port 4000
- **"Backend error"**: Check terminal for yt-dlp errors

### Extension Issues
- **"Unable to load video information"**: Ensure you're on a YouTube video page
- **Download fails**: Check if backend server is running
- **"File wasn't available"**: The video might be region-locked or private

### Common Solutions
1. **Restart the backend server** if it stops working
2. **Reload the extension** after making changes
3. **Check browser console** (F12) for error messages
4. **Try a different video** if one doesn't work

## 🌐 Deploying Backend (Optional)

For production use, deploy the backend to a cloud service:

**Heroku:**
```bash
git init
heroku create your-yt-downloader
git add .
git commit -m "Initial commit"
git push heroku main
```

Then update `popup.js` to use your deployed URL instead of `localhost:4000`.

## 📁 File Structure

```
Download_extension/
├── manifest.json          # Extension configuration
├── popup.html            # Extension popup UI
├── popup.js              # Popup logic (calls backend)
├── content.js            # Page content script
├── background.js         # Extension background script
├── backend/
│   ├── package.json      # Backend dependencies
│   ├── server.js         # Express server with yt-dlp
│   └── node_modules/     # Dependencies
└── SETUP.md              # This file
```

## 🎉 Success!

You now have a fully functional YouTube video downloader that:
- ✅ Shows real video titles
- ✅ Lists all available qualities
- ✅ Downloads actual MP4/WebM files
- ✅ Works with most YouTube videos
- ✅ Provides one-click experience

Enjoy your downloads! 🎬 