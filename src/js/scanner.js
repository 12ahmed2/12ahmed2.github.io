function onScanSuccess(decodedText, decodedResult) {
    // Handle the scanned code
    document.getElementById('result').innerText = decodedText;
    // You can redirect or send data to backend here
    // Example: window.location.href = decodedText;
  }

function onScanFailure(error) {
    // alert(`Error scanning QR code: ${error}`);
  }

let html5QrcodeScanner = new Html5QrcodeScanner(
"qr-reader", { fps: 10, qrbox: 250 });

html5QrcodeScanner.render(onScanSuccess, onScanFailure);
