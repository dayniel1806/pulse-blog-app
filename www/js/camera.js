document.addEventListener("deviceready", function() {
  console.log("Device ready. navigator.camera exists:", !!navigator.camera);
});


let capturedImageBase64 = null;
const capturedPreview = document.querySelector("#captured-preview");

// Wait for Cordova to be ready
document.addEventListener("deviceready", function() {
    console.log("Cordova is ready!");
    
    // Check if camera plugin is available
    if (typeof navigator.camera === 'undefined') {
        console.error("Camera plugin not found! Please install it.");
        alert("Camera plugin not found. Please install: cordova plugin add cordova-plugin-camera");
        return;
    }
    
    // Setup camera button
    document.querySelector("#btn-capture").addEventListener("click", function() {
        console.log("Camera button clicked");
        takePicture();
    });
});

function takePicture() {
    console.log("Taking picture...");
    
    navigator.camera.getPicture(
        onCaptureSuccess, 
        onCaptureError, 
        {
            quality: 40,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,  // Explicitly use camera
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 800,
            targetHeight: 800,
            correctOrientation: true,
            saveToPhotoAlbum: false  // Optional: set to true if you want to save
        }
    );
}

function onCaptureSuccess(imageData) {
    console.log("Camera success! Image captured.");
    capturedImageBase64 = imageData;
    capturedPreview.src = "data:image/jpeg;base64," + imageData;
    capturedPreview.style.display = "block";
}

function onCaptureError(error) {
    console.error("Camera error: " + error);
    
    // More specific error messages
    let errorMessage = "Camera failed: ";
    if (error === 20) {
        errorMessage += "Permission denied. Please grant camera permission in settings.";
    } else if (error === 1) {
        errorMessage += "No camera available on this device.";
    } else if (error === 2) {
        errorMessage += "Camera is being used by another application.";
    } else {
        errorMessage += error;
    }
    
    alert(errorMessage);
}

// ---- FILE UPLOAD (fallback / alternative to camera) ----
document.querySelector("#btn-upload").addEventListener("click", function() {
    document.querySelector("#file-upload").click();
});

document.querySelector("#file-upload").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function() {
        capturedPreview.src = reader.result;
        capturedPreview.style.display = "block";
        capturedImageBase64 = reader.result.split(",")[1];
    };
    reader.readAsDataURL(file);
});