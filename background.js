// Enable the action only on YouTube video pages
chrome.runtime.onInstalled.addListener(() => {
  chrome.action.disable();
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostContains: 'youtube.com', pathContains: 'watch'},
      })],
      actions: [new chrome.declarativeContent.ShowAction()]
    }]);
  });
});

// Listen for messages from content script and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'download') {
    console.log('Starting download:', message.filename);
    chrome.downloads.download({
      url: message.url,
      filename: message.filename,
      saveAs: true  // Let user choose location
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        console.error('Download failed:', chrome.runtime.lastError);
        sendResponse({success: false, error: chrome.runtime.lastError.message});
      } else {
        console.log('Download started with ID:', downloadId);
        sendResponse({success: true, downloadId: downloadId});
      }
    });
    return true; // Keep message channel open for async response
  }
}); 