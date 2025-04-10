document.addEventListener("DOMContentLoaded", function () {
    const transcribeButton = document.getElementById("transcribeButton");

    if (transcribeButton) {
        transcribeButton.addEventListener("click", function () {
            console.log("Transcribe button clicked!");
            chrome.runtime.sendMessage({ action: "transcribe_video" });
        });
    } else {
        console.error("Transcribe button not found in popup.html");
    }
});
