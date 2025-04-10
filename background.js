chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "transcribe_video") {
        console.log("Received transcribe request from popup.");

        // Ensure we get the active tab
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length === 0) {
                console.error("No active tab found!");
                return;
            }

            let tabId = tabs[0].id;
            
            // Check if chrome.scripting API is available
            if (chrome.scripting) {
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ["content.js"]
                }).catch((err) => console.error("Error executing script:", err));
            } else {
                console.error("chrome.scripting API is not available.");
            }
        });

        sendResponse({ status: "Processing transcription" });
    }
});
