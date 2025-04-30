// report.js
document.addEventListener('DOMContentLoaded', () => {
    chrome.runtime.sendMessage({ action: 'getUsageData' }, (response) => {
      console.log("Received usage data:", response); // ✅ This shows in DevTools
  
      if (response) {
        const tableBody = document.querySelector('#usageTable tbody');
        tableBody.innerHTML = '';
  
        for (const [site, time] of Object.entries(response)) {
          const row = document.createElement('tr');
  
          const siteCell = document.createElement('td');
          const timeCell = document.createElement('td');
  
          siteCell.textContent = site;
          timeCell.textContent = time.toFixed(2);
  
          row.appendChild(siteCell);
          row.appendChild(timeCell);
          tableBody.appendChild(row);
        }
      } else {
        console.warn("No data received from background.js");
      }
    });
  });
  