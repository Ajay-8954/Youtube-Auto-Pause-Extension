let currentTabId = null;

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  const url = new URL(tab.url);

  if (currentTabId !== null) {
    chrome.scripting.executeScript({
      target: {tabId: currentTabId},
      func: () => {
        const video = document.querySelector('video');
        if (video) {
          video.pause();
        }
      }
    });
  }

  currentTabId = null;

  if (url.hostname === 'www.youtube.com' && url.pathname === '/watch') {
    currentTabId = activeInfo.tabId;
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url.includes('youtube.com/watch')) {
    currentTabId = tabId;
  }
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  if (tabId === currentTabId) {
    currentTabId = null;
  }
});

chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE && currentTabId !== null) {
    chrome.scripting.executeScript({
      target: {tabId: currentTabId},
      func: () => {
        const video = document.querySelector('video');
        if (video) {
          video.pause();
        }
      }
    });
  }
});
