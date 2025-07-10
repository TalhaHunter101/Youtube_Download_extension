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

    // Get video info using yt-dlp
    const command = `yt-dlp -J --no-warnings "${url}"`;
    const { stdout } = await execAsync(command);
    const info = JSON.parse(stdout);

    const formats = (info.formats || []).filter(f => f.ext && f.filesize && f.url);

    const mapped = formats.map(f => ({
      itag: f.format_id,
      url: f.url,
      quality: f.quality_label || f.format_note || `${f.height}p` || 'unknown',
      extension: f.ext,
      size: f.filesize || 0,
      hasAudio: !!f.asr,
      hasVideo: !!f.height,
      width: f.width,
      height: f.height,
      fps: f.fps
    }));

    // Sort by quality (video+audio first, then by resolution)
    const sortedFormats = mapped.sort((a, b) => {
      if (a.hasVideo && a.hasAudio && !(b.hasVideo && b.hasAudio)) return -1;
      if (!(a.hasVideo && a.hasAudio) && b.hasVideo && b.hasAudio) return 1;
      return (b.height || 0) - (a.height || 0);
    });

    // Choose default best quality (first video+audio highest quality)
    const best = sortedFormats.find(m => m.hasVideo && m.hasAudio) || sortedFormats[0];

    res.json({
      title: info.title,
      formats: sortedFormats,
      best: best
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to fetch video info: ' + err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Downloader backend listening on :${PORT}`);
  console.log('Make sure yt-dlp is installed: pip install yt-dlp or brew install yt-dlp');
}); 