let html5QrcodeScanner;
let scanCompleted = false;

// Called when QR code is detected
async function onScanSuccess(decodedText) {
    // Prevent duplicate scans
    if (scanCompleted) return;

    scanCompleted = true;

    // Show temporary message
    document.getElementById("result").innerText = "Processing attendance...";

    try {
        // Stop scanner immediately
        if (html5QrcodeScanner) {
            await html5QrcodeScanner.clear();
        }

        // Get logged-in user
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) {
            alert("Please login first");
            window.location.href = "/login.html";
            return;
        }

        // Send attendance request
        const response = await fetch("/api/mark-attendance", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                qrId: decodedText,
                userId: user._id
            })
        });

        const data = await response.json();

        // Show server message (e.g. "Visit 1 Started")
        alert(data.message || "Attendance marked successfully");

        // Redirect to dashboard after 1 second
        setTimeout(() => {
            window.location.href = "/dashboard.html";
        }, 1000);

    } catch (error) {
        console.error("Error marking attendance:", error);
        alert("Something went wrong");
        scanCompleted = false; // Allow retry if request fails
    }
}

// Start scanner when scan page loads
document.addEventListener("DOMContentLoaded", function () {
    // Only run on scan.html
    const reader = document.getElementById("reader");
    if (!reader) return;

    html5QrcodeScanner = new Html5QrcodeScanner(
        "reader",
        {
            fps: 10,
            qrbox: 250
        },
        false
    );

    html5QrcodeScanner.render(onScanSuccess);
});