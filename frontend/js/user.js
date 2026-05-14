

document.addEventListener("DOMContentLoaded", function () {

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        window.location.href = "./login.html";
        return;
    }

    function onScanSuccess(decodedText) {
        
    }

    html5QrCode = new Html5Qrcode("reader");

    Html5Qrcode.getCameras().then(devices => {
        if (devices.length > 0) {
            html5QrCode.start(
                devices[0].id,
                { fps: 10, qrbox: 250 },
                onScanSuccess
            );
        }
    });
});
    // when QR is scanned
    function onScanSuccess(decodedText) {

    console.log("Scanned QR:", decodedText);

    document.getElementById("result").innerText = "Scanned: " + decodedText;

    const user = JSON.parse(localStorage.getItem("user"));

    fetch("/api/scan", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userId: user._id,
            userName: user.name,
            qrId: decodedText
        })
    })
    .then(res => res.json())
    .then(data => {

        alert(data.message);

        // iMPORTANT: stop scanner before redirect
        html5QrCode.stop().then(() => {

            // redirect
            setTimeout(() => {
                window.location.href = "./dashboard.html";
            }, 1000);

        });

    })
    .catch(err => {
        console.log(err);
    });
}

    // start scanner
    const html5QrCode = new Html5Qrcode("reader");

    Html5Qrcode.getCameras().then(devices => {

        console.log("Available cameras:", devices);

        if (devices.length > 0) {

            html5QrCode.start(
                devices[0].id,
                {
                    fps: 10,
                    qrbox: 250
                },
                onScanSuccess
            );

        } else {
            alert("No camera found");
        }

    }).catch(err => {
        console.log("Camera error:", err);
    });

