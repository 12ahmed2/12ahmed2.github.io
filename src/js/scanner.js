// Grab elements by ID
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
const resultElement = document.getElementById('result');
const videoElement = document.getElementById('reader'); // hidden video element
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

let cameraStream = null;
let animationFrameId = null;

// Function to start scanning
async function startScanning() {
  try {
    resultElement.textContent = '';
    
    // Request camera access (HTTPS or localhost required)
    cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    videoElement.srcObject = cameraStream;
    await videoElement.play();

    // Show canvas
    canvas.style.display = 'block';

    // Start scanning loop
    animationFrameId = requestAnimationFrame(drawCanvas);

    // Update buttons
    startButton.disabled = true;
    stopButton.disabled = false;
  } catch (err) {
    console.error("Camera access error:", err);
    resultElement.textContent = "Error: Could not access camera. Make sure your site is HTTPS and permission is granted.";
    startButton.disabled = false;
    stopButton.disabled = true;
  }
}

// Function to stop scanning
function stopScanning() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
  }

  canvas.style.display = 'none';
  startButton.disabled = false;
  stopButton.disabled = true;
}

// Function to draw video onto canvas and scan QR
function drawCanvas() {
  if (videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert" });

    if (code) {
      resultElement.textContent = code.data;
      stopScanning();
      return;
    }
  }

  animationFrameId = requestAnimationFrame(drawCanvas);
}

// Attach button event listeners
startButton.addEventListener('click', startScanning);
stopButton.addEventListener('click', stopScanning);
