document.addEventListener('DOMContentLoaded', async () => {
  const loadingDiv = document.getElementById('loading');
  const errorDiv = document.getElementById('error');
  const contentDiv = document.getElementById('content');
  const videoTitleEl = document.getElementById('videoTitle');
  const qualityOptionsEl = document.getElementById('qualityOptions');
  const downloadBtn = document.getElementById('downloadBtn');

  let selectedFormat = null;
  let videoTitle = 'Unknown Video';

  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const currentTab = tabs[0];
    
    if (!currentTab.url || !currentTab.url.includes('youtube.com/watch')) {
      throw new Error('Please navigate to a YouTube video page');
    }
    
    const urlObj = new URL(currentTab.url);
    const videoId = urlObj.searchParams.get('v');
    if (!videoId) {
      throw new Error('No video ID found in URL');
    }

    console.log('Fetching video info for ID:', videoId);

    // Fetch info from backend with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const resp = await fetch('http://localhost:4000/getDownload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoId }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!resp.ok) {
      const errorText = await resp.text();
      throw new Error(`Backend error (${resp.status}): ${errorText}`);
    }

    const data = await resp.json();
    console.log('Received data:', data);

    if (data.error) {
      throw new Error(data.error);
    }

    videoTitle = data.title || 'Unknown Video';
    const formats = data.formats || [];
    
    if (formats.length === 0) {
      throw new Error('No downloadable formats found for this video');
    }

    displayVideoInfo(videoTitle, formats);

  } catch (err) {
    console.error('Error:', err);
    showError(err.message);
  }

  function displayVideoInfo(title, formats) {
    loadingDiv.style.display = 'none';
    contentDiv.style.display = 'block';
    videoTitleEl.textContent = title;

    qualityOptionsEl.innerHTML = '';
    
    // Filter and sort formats
    const validFormats = formats.filter(f => f.url && f.size > 0);
    
    if (validFormats.length === 0) {
      showError('No valid formats available for download');
      return;
    }

    validFormats.forEach((f, idx) => {
      const option = document.createElement('div');
      option.className = 'quality-option';

      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'quality';
      radio.value = idx;
      if (idx === 0) {
        radio.checked = true;
        selectedFormat = f;
        option.classList.add('selected');
      }

      const label = document.createElement('label');
      const sizeText = f.size ? `${(f.size/1048576).toFixed(1)} MB` : 'Unknown size';
      const qualityText = f.quality || 'Unknown quality';
      const extensionText = f.extension ? f.extension.toUpperCase() : 'Unknown';
      
      label.innerHTML = `
        <span class='quality-label-text'>${qualityText}</span> 
        <span class='quality-details'>${sizeText} ${extensionText}</span>
      `;

      option.appendChild(radio);
      option.appendChild(label);
      option.addEventListener('click', () => {
        document.querySelectorAll('.quality-option').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        radio.checked = true;
        selectedFormat = f;
        downloadBtn.disabled = false;
      });
      qualityOptionsEl.appendChild(option);
    });

    downloadBtn.disabled = false;
    downloadBtn.addEventListener('click', async () => {
      if (!selectedFormat) return;
      
      downloadBtn.disabled = true;
      downloadBtn.textContent = 'Downloading...';
      
      try {
        const cleanTitle = videoTitle.replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '_');
        const filename = `${cleanTitle}_${selectedFormat.quality}.${selectedFormat.extension}`;
        
        const resp = await chrome.runtime.sendMessage({ 
          type: 'download', 
          url: selectedFormat.url, 
          filename 
        });
        
        if (resp && resp.success) {
          downloadBtn.textContent = '✓ Download Started';
          setTimeout(() => window.close(), 1000);
        } else {
          throw new Error(resp?.error || 'Download failed');
        }
      } catch (error) {
        console.error('Download error:', error);
        downloadBtn.textContent = 'Download Failed';
        downloadBtn.style.background = '#d73027';
        setTimeout(() => {
          downloadBtn.textContent = 'Download Video';
          downloadBtn.style.background = '#ff0000';
          downloadBtn.disabled = false;
        }, 2000);
      }
    });
  }

  function showError(message) {
    loadingDiv.style.display = 'none';
    errorDiv.style.display = 'block';
    
    // Update error message
    errorDiv.innerHTML = `
      <div>❌ ${message}</div>
      <div style="font-size: 12px; margin-top: 8px;">
        ${getErrorSuggestion(message)}
      </div>
    `;
  }

  function getErrorSuggestion(message) {
    if (message.includes('Failed to fetch') || message.includes('NetworkError')) {
      return 'Make sure the backend server is running on port 4000';
    }
    if (message.includes('Backend error')) {
      return 'Check the backend server logs for more details';
    }
    if (message.includes('YouTube video page')) {
      return 'Navigate to a YouTube video page and try again';
    }
    if (message.includes('No video ID')) {
      return 'Make sure the YouTube URL contains a video ID (v= parameter)';
    }
    return 'Try refreshing the page or restarting the backend server';
  }
}); 