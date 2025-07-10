const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.post('/getDownload', async (req, res) => {
  const { videoId } = req.body;
  if (!videoId) return res.status(400).json({ error: 'videoId is required' });

  try {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    
    // Check if yt-dlp is installed
    try {
      await execAsync('yt-dlp --version');
    } catch (error) {
      return res.status(500).json({ 
        error: 'yt-dlp not found. Please install it first: pip install yt-dlp or brew install yt-dlp' 
      });
    }

    // Get video info with all formats
    const command = `yt-dlp -J --no-warnings "${url}"`;
    const { stdout } = await execAsync(command);
    const info = JSON.parse(stdout);

    // Create predefined MP4 options that we know work
    const mp4Options = [
      {
        id: 'best-mp4',
        quality: 'Best Quality MP4',
        description: 'Highest quality MP4 with audio',
        format: 'best[ext=mp4]/best',
        extension: 'mp4'
      },
      {
        id: '1080p-mp4',
        quality: '1080p MP4',
        description: 'Full HD MP4 with audio',
        format: 'best[ext=mp4][height<=1080]/best[height<=1080]',
        extension: 'mp4'
      },
      {
        id: '720p-mp4',
        quality: '720p MP4',
        description: 'HD MP4 with audio',
        format: 'best[ext=mp4][height<=720]/best[height<=720]',
        extension: 'mp4'
      },
      {
        id: '480p-mp4',
        quality: '480p MP4',
        description: 'SD MP4 with audio',
        format: 'best[ext=mp4][height<=480]/best[height<=480]',
        extension: 'mp4'
      }
    ];

    // Convert to the format expected by frontend
    const availableFormats = mp4Options.map(option => ({
      id: option.id,
      quality: option.quality,
      description: option.description,
      format: option.format,
      extension: option.extension,
      url: 'yt-dlp-download',
      size: 0,
      hasAudio: true,
      hasVideo: true
    }));

    res.json({
      title: info.title,
      formats: availableFormats,
      best: availableFormats[0]
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to fetch video info: ' + err.message });
  }
});

// Simplified endpoint for MP4 downloads
app.post('/downloadMerged', async (req, res) => {
  const { videoId, formatId } = req.body;
  if (!videoId || !formatId) return res.status(400).json({ error: 'videoId and formatId are required' });

  try {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    
    // Format mapping - these are yt-dlp format selectors that work reliably
    const formatMap = {
      'best-mp4': 'best[ext=mp4]/best',
      '1080p-mp4': 'best[ext=mp4][height<=1080]/best[height<=1080]',
      '720p-mp4': 'best[ext=mp4][height<=720]/best[height<=720]',
      '480p-mp4': 'best[ext=mp4][height<=480]/best[height<=480]'
    };
    
    const format = formatMap[formatId] || 'best';
    
    // Use yt-dlp to get the download URL
    const command = `yt-dlp -g -f "${format}" --no-warnings "${url}"`;
    const { stdout } = await execAsync(command);
    const downloadUrl = stdout.trim();
    
    if (!downloadUrl) {
      throw new Error('No download URL found');
    }
    
    res.json({
      success: true,
      url: downloadUrl
    });
  } catch (err) {
    console.error('Error getting download URL:', err);
    res.status(500).json({ error: 'Failed to get download URL: ' + err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Downloader backend listening on :${PORT}`);
  console.log('Make sure yt-dlp is installed: pip install yt-dlp or brew install yt-dlp');
}); 