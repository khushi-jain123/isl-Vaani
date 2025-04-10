console.log("Sign Language Extension Loaded!");

// Function to capture and send audio from microphone
async function captureAudioFromVideo() {
    try {
        // Request microphone access
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });

        if (!audioStream) {
            console.error("No audio stream available.");
            return;
        }

        // Check if MediaRecorder is supported
        if (!window.MediaRecorder) {
            console.error("MediaRecorder API is not supported in this browser.");
            alert("Your browser does not support audio recording.");
            return;
        }

        // Check for compatible MIME type
        let mimeType = "audio/webm";
        if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = "audio/ogg"; // Fallback for unsupported types
        }

        const mediaRecorder = new MediaRecorder(audioStream, { mimeType });

        let audioChunks = [];
        mediaRecorder.ondataavailable = event => {
            if (event.data.size > 0) {
                audioChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = async () => {
            console.log("Recording stopped. Sending audio for transcription...");

            const audioBlob = new Blob(audioChunks, { type: mimeType });
            const formData = new FormData();
            formData.append("audio", audioBlob, "audio." + (mimeType.includes("ogg") ? "ogg" : "webm"));

            try {
                const response = await fetch("http://127.0.0.1:5000/transcribe", {
                    method: "POST",
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                console.log("Transcription Result:", data.transcription);
                alert("Transcription: " + data.transcription);
            } catch (error) {
                console.error("Error sending request to backend:", error);
            }
        };

        mediaRecorder.start();
        setTimeout(() => mediaRecorder.stop(), 5000);

    } catch (error) {
        console.error("Error capturing audio:", error);
        alert("Error: " + error.message);
    }
}

// Add a floating button to start transcription
const button = document.createElement("button");
button.innerText = "Transcribe Audio";
button.style.position = "fixed";
button.style.bottom = "10px";
button.style.right = "10px";
button.style.zIndex = "1000";
button.style.padding = "10px";
button.style.background = "#28a745";
button.style.color = "white";
button.style.border = "none";
button.style.borderRadius = "5px";
button.style.cursor = "pointer";

button.onclick = captureAudioFromVideo;
document.body.appendChild(button);
