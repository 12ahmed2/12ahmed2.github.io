// function onScanSuccess(decodedText, decodedResult) {
//     // Handle the scanned code
//     document.getElementById('result').innerText = decodedText;
//     // You can redirect or send data to backend here
//     // Example: window.location.href = decodedText;
//   }

// function onScanFailure(error) {
//     alert(`Error scanning QR code: ${error}`);
//   }

// let html5QrcodeScanner = new Html5QrcodeScanner(
// "qr-reader", { fps: 10, qrbox: 250 });
// html5QrcodeScanner.render(onScanSuccess, onScanFailure);

// Function to start scanning


const videoElement = document.getElementById('reader');
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
const messageElement = document.getElementById('result');
const canvas = document.getElementById('canvas');
// variable to hold the camera stream
let cameraStream = null;
let animationFrameId = null;


async function startScanning() {
  try {
    // Clear any previous errors or messages
    messageElement.style.display = 'none';
    messageElement.textContent = '';
                
    // Request camera access. The 'environment' facingMode is a hint to use the back camera on mobile devices.
    cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                
    // Attach the stream to the video element
    videoElement.srcObject = cameraStream;
    videoElement.play();
    videoElement.style.display = 'block';

    animationFrameId = requestAnimationFrame(drawcanvas);

    // Update button states
    startButton.disabled = true;
    stopButton.disabled = false;
  } catch (err) {
    // If permission is denied or no camera is found, show an error message
    console.error("Error accessing camera: ", err);
    messageElement.textContent = "Error: Could not access camera. Please ensure you have a camera and have granted permission.";
    messageElement.style.display = 'block';

    // Update button states
    startButton.disabled = false;
    stopButton.disabled = true;
    }
}

// Function to stop scanning
function stopScanning() {
  // Cancel the animation frame to stop the scanning loop
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null; // Clear the ID
  }

  if (cameraStream) {
    // Stop all tracks in the stream (e.g., video)
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
    videoElement.srcObject = null;
    videoElement.style.display = 'none';
  }
  // Update button states
  startButton.disabled = false;
  stopButton.disabled = true;
}


// Function to draw the video frame onto a canvas
function drawcanvas() {
  if (videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
    canvas.width = videoElement.videoWidth; 
    canvas.height = videoElement.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert",
    });

    if (code) {
      // QR code found!
      messageElement.textContent = `Found QR code: ${code.data}`;
      stopScanning();
    } else {
      // If no QR code is found, continue scanning
      animationFrameId = requestAnimationFrame(drawcanvas);
    }
  } else {
    // If the video element is not ready, continue waiting
    animationFrameId = requestAnimationFrame(drawcanvas);
  }
}


// Attach event listeners to the buttons
startButton.addEventListener('click', startScanning);
stopButton.addEventListener('click', stopScanning);
