# How to Reload the Extension

After making changes to the extension code, follow these steps:

1. Go to `chrome://extensions/` in your browser
2. Find the "YouTube Video Downloader" extension
3. Click the **refresh/reload** button (circular arrow icon) on the extension card
4. Go to a YouTube video page and test the extension

## Testing Steps:

1. Navigate to any YouTube video (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)
2. Click the extension icon in the toolbar
3. Check the browser console (F12) for any error messages
4. The download should start and you'll be prompted to save the file

## Troubleshooting:

- If you see "Receiving end does not exist" error, make sure to reload the extension
- Check the console in both the extension's background page and the YouTube page
- Make sure you're on a video page (URL contains `/watch?v=`)
- Some videos may be protected and cannot be downloaded 