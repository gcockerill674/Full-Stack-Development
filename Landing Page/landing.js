function getLocation() {
    const output = document.getElementById("location-output");

    if (!navigator.geolocation) {
        output.textContent = "Geolocation is not supported by this browser.";
        return;
    }

    output.textContent = "Requesting your location...";
    navigator.geolocation.getCurrentPosition(showPosition, showError);
}

function showPosition(position) {
    const output = document.getElementById("location-output");
    const latitude = position.coords.latitude.toFixed(6);
    const longitude = position.coords.longitude.toFixed(6);

    output.textContent = `Latitude: ${latitude}, Longitude: ${longitude}`;
}

function showError(error) {
    const output = document.getElementById("location-output");
    const messages = {
        1: "Location permission was denied.",
        2: "Your location could not be determined.",
        3: "The location request timed out."
    };

    output.textContent = messages[error.code] || "An unknown location error occurred.";
}
