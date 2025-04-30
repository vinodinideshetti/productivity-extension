let activeTabStartTime = null;
let activeTabId = null;
let websiteUsage = {};

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  await trackTime();
  activeTabId = activeInfo.tabId;
  activeTabStartTime = Date.now();
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.status === 'complete') {
    await trackTime();
    activeTabId = tabId;
    activeTabStartTime = Date.now();
  }
});

chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    await trackTime();
    activeTabId = null;
    activeTabStartTime = null;
  } else {
    let [tab] = await chrome.tabs.query({ active: true, windowId });
    if (tab) {
      await trackTime();
      activeTabId = tab.id;
      activeTabStartTime = Date.now();
    }
  }
});

async function trackTime() {
  if (activeTabId !== null && activeTabStartTime !== null) {
    try {
      let tab = await chrome.tabs.get(activeTabId);
      if (tab && tab.url) {
        let hostname = new URL(tab.url).hostname;
        let timeSpent = (Date.now() - activeTabStartTime) / 1000; // seconds

        if (!websiteUsage[hostname]) {
          websiteUsage[hostname] = 0;
        }
        websiteUsage[hostname] += timeSpent;

        console.log('✅ Tracked:', hostname, timeSpent, '→', websiteUsage);
      }
    } catch (error) {
      console.error('Failed to track time:', error.message);
    }
  }
}

// Respond to report request
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getUsageData') {
    sendResponse(websiteUsage);
  }
});
