// Simplified content script - backend handles all video extraction
console.log('YouTube Video Downloader content script loaded');

// Listen for messages from popup and background (legacy support)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Content script received message:', message.type);
  
  if (message.type === 'getVideoInfo') {
    // This is now handled by the backend, but we keep this for compatibility
    console.log('getVideoInfo request - redirecting to backend');
    sendResponse({success: false, error: 'Use backend API instead'});
    return true;
  }
  
  if (message.type === 'initiateDownload') {
    // Legacy support - not used with popup approach
    console.log('Legacy download request - not supported');
    sendResponse({success: false, error: 'Use popup interface instead'});
    return true;
  }
});

// Check if we're on a video page
if (window.location.pathname === '/watch') {
  console.log('On YouTube video page:', window.location.href);
  
  // Extract video ID for potential use
  const urlParams = new URLSearchParams(window.location.search);
  const videoId = urlParams.get('v');
  if (videoId) {
    console.log('Video ID detected:', videoId);
  }
} 