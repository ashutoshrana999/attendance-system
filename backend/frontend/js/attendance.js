let html5QrcodeScanner;
let scanCompleted = false;

// QR scan success callback
async function onScanSuccess(decodedText) {
    // Prevent duplicate scans
    if (scanCompleted) return;

    scanCompleted = true;

    try {
        // Stop scanner immediately
        if (html5QrcodeScanner) {
            html5QrcodeScanner.clear();
        }

        // Send attendance request to backend
        const response = await fetch("/api/mark-attendance", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                qrId: decodedText
            })
        });

        const data = await response.json();

        alert(data.message || "Attendance marked successfully");

        // Redirect after successful scan
        window.location.href = "dashboard.html";

    } catch (error) {
        console.error("Error marking attendance:", error);
        alert("Something went wrong");

        // Allow retry if API call fails
        scanCompleted = false;
    }
}


document.addEventListener("DOMContentLoaded", async function () {

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        window.location.href = "./login.html";
        return;
    }

    const res = await fetch(`/api/user-attendance/${user._id}`);
    const data = await res.json();

    const container = document.getElementById("attendanceList");

    container.innerHTML = "";

    if (data.length === 0) {
        container.innerHTML = `<p class="no-data">No attendance yet</p>`;
        return;
    }

    data.forEach(item => {

        const div = document.createElement("div");
        div.classList.add("att-card");

        const date = new Date(item.scannedAt);

        const inTime = item.inTime
            ? new Date(item.inTime).toLocaleTimeString()
            : "-";

        const outTime = item.outTime
            ? new Date(item.outTime).toLocaleTimeString()
            : "-";

        div.innerHTML = `
            <h3>${item.qrName}</h3>
            <p><strong>Date:</strong> ${item.date}</p>
            <p><strong>Visit:</strong> ${item.visitNumber}</p>
            <p><strong>In Time:</strong> ${inTime}</p>
            <p><strong>Out Time:</strong> ${outTime}</p>
        `;

        container.appendChild(div);
    });

});