# YouTube Video Downloader Chrome Extension

This extension allows you to download YouTube videos as **MP4 files with both audio and video** by clicking the extension icon on a YouTube video page.

## ✨ Features

- **MP4 Only**: Downloads only MP4 format files (no confusing format options)
- **Audio + Video Guaranteed**: Every download includes both audio and video
- **Multiple Quality Options**: Choose from Best Quality, 1080p, 720p, or 480p
- **Smart Format Selection**: Uses yt-dlp's intelligent format merging
- **One-Click Download**: Simple and fast download process

## Installation

1. Download or clone this repository to your local machine.

2. **Install yt-dlp** (required for video processing):
   ```bash
   # On macOS
   brew install yt-dlp
   
   # On Linux/Windows
   pip install yt-dlp
   ```

3. **Start the backend server**:
   ```bash
   cd backend
   npm install
   npm start
   ```
   Keep this terminal open - the server needs to run while using the extension.

4. **Install the Chrome extension**:
   - Open Google Chrome and navigate to `chrome://extensions/`
   - Enable **Developer mode** in the top right corner
   - Click **Load unpacked** and select this extension directory
   - The extension should now appear in your extensions list

## Usage

1. Navigate to any YouTube video page (e.g., `https://www.youtube.com/watch?v=VIDEO_ID`)

2. Click the extension icon in the toolbar

3. **Select your preferred quality**:
   - **Best Quality MP4**: Highest available quality
   - **1080p MP4**: Full HD quality
   - **720p MP4**: HD quality  
   - **480p MP4**: Standard definition

4. Click **Download Video** - Chrome will prompt you to choose save location

5. The downloaded MP4 file will contain both video and audio!

## Technical Details

- **Backend**: Node.js server using yt-dlp for video processing
- **Format Selection**: Uses yt-dlp's advanced format filtering
- **Quality Assurance**: Only shows formats with both audio and video
- **Smart Merging**: Automatically merges separate video/audio streams when needed

## Troubleshooting

**"Unable to load video information"**
- Make sure backend server is running (`cd backend && npm start`)
- Ensure you're on a YouTube video page

**"Failed to fetch"**
- Check if localhost:4000 is accessible
- Restart the backend server

**"No MP4 formats available"**
- Video might be region-locked or private
- Try a different video

## Disclaimer

Downloading YouTube videos may violate YouTube's terms of service. Use this extension responsibly and only for personal use. 