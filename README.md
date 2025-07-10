# YouTube Video Downloader Chrome Extension

This extension allows you to download YouTube videos locally to your computer by clicking the extension icon on a YouTube video page.

## Installation

1. Download or clone this repository to your local machine.

2. Open Google Chrome and navigate to `chrome://extensions/`.

3. Enable **Developer mode** in the top right corner.

4. Click **Load unpacked** and select the directory where you saved this extension (the folder containing `manifest.json`).

5. The extension should now appear in your extensions list and be ready to use.

## Usage

1. Navigate to a YouTube video page (e.g., `https://www.youtube.com/watch?v=VIDEO_ID`).

2. The extension icon should appear in the toolbar (or be enabled).

3. Click the extension icon to initiate the download.

4. A save dialog will appear, allowing you to choose the location and name for the downloaded MP4 file.

5. The download will proceed in the background.

## Limitations

- This extension downloads the highest quality available format with video and audio combined.
- It may not work for all videos due to YouTube's restrictions or changes in their API.
- For age-restricted or private videos, additional handling might be needed.

## Development

- `manifest.json`: Extension configuration.
- `background.js`: Handles background tasks and downloads.
- `content.js`: Extracts video information from the page.

Feel free to modify the code as needed. If you encounter issues, check the console for errors (`chrome://extensions/` > Inspect views).

## Disclaimer

Downloading YouTube videos may violate YouTube's terms of service. Use this extension responsibly and only for personal use. 