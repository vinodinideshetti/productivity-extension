document.getElementById('viewReport').addEventListener('click', () => {
  chrome.tabs.create({ url: chrome.runtime.getURL('view_report.html') });
});
