from flask import Flask, request, jsonify
import os

app = Flask(__name__)

@app.route('/transcribe', methods=['POST'])
def transcribe_audio():
    try:
        if 'audio' not in request.files:
            return jsonify({"error": "No audio file provided"}), 400

        audio_file = request.files['audio']
        if audio_file.filename == '':
            return jsonify({"error": "Empty file"}), 400

        # Save file for debugging
        audio_file.save("debug_audio.webm")

        # Here, insert your transcription logic (e.g., using Whisper, SpeechRecognition, etc.)
        # Example:
        transcription = "Test transcription"

        return jsonify({"transcription": transcription})

    except Exception as e:
        print(f"❌ Server Error: {str(e)}")
        return jsonify({"error": "Internal Server Error"}), 500

if __name__ == '__main__':
    app.run(debug=True)
