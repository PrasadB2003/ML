const emojiMap = {
  "neutral": "😐",
  "calm": "😌",
  "happy": "😄",
  "sad": "😢",
  "angry": "😠",
  "fearful": "😨",
  "disgust": "🤢",
  "surprised": "😲",
  "unknown": "❓"
};

function displayResult(emotion) {
  const emoji = emojiMap[emotion.toLowerCase()] || "❓";
  const capitalized = emotion.charAt(0).toUpperCase() + emotion.slice(1);

  // Main Result Display
  document.getElementById("result").innerHTML = `
    <div>Detected Emotion:</div>
    <div class="emoji">${emoji} ${capitalized}</div>
  `;

  // Add to Report Section
  const report = document.getElementById("reportBody");
  const timestamp = new Date().toLocaleString();
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <td>${timestamp}</td>
    <td>${capitalized}</td>
    <td>${emoji}</td>
  `;
  report.appendChild(newRow);
}

Dropzone.options.audioDropzone = {
  paramName: "file",
  maxFilesize: 10,
  acceptedFiles: ".wav,.mp3,.flac",
  init: function () {
    this.on("success", function (file, response) {
      const emotion = response.emotion.toLowerCase();
      displayResult(emotion);
    });

    this.on("error", function (file, errorMessage) {
      const msg = typeof errorMessage === 'string' ? errorMessage : errorMessage.error || "Upload error.";
      document.getElementById("result").innerHTML = `<p style="color: red;">Error: ${msg}</p>`;
    });
  }
};

// Dark mode toggle
document.getElementById('darkModeToggle').addEventListener('change', () => {
  document.body.classList.toggle('dark-mode');
});

// Initialize WaveSurfer
const wavesurfer = WaveSurfer.create({
  container: '#waveform',
  waveColor: '#3498db',
  progressColor: '#1abc9c',
  height: 80,
  responsive: true
});

// Load a default or sample audio file
wavesurfer.load('uploads/sample.wav'); // Replace this with dynamic logic if needed

document.getElementById('playPauseBtn').addEventListener('click', () => {
  wavesurfer.playPause();
});
