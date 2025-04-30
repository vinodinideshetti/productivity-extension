chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "TRACK_SITE") {
      console.log("Tracking site:", message.url);
      // In next steps, we’ll save this data and send it to the backend
    }
  });
  