let dynamicInterval = null;

document.addEventListener("DOMContentLoaded", async function () {
    console.log("admin.js loaded");

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        alert("Please login first");
        window.location.href = "./login.html";
        return;
    }

   
    const btn = document.getElementById("generateBtn");
    if (btn) {
        btn.addEventListener("click", generateQR);
    }

    // load existing qr codes
    const dynamicQR = await loadQRCodes();

    //  restart auto-refresh
    if (dynamicQR) {
        startDynamicRefresh(dynamicQR.qrName);
    }
});



// generate qr

async function generateQR() {
    const qrNameInput = document.getElementById("qrName");
    const qrTypeInput = document.getElementById("qrType");

    const qrName = qrNameInput.value.trim();
    const type = qrTypeInput.value;

    if (!qrName) {
        alert("Please enter QR name");
        return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    try {
        const res = await fetch("https://attendance-system-1ghe.onrender.com/api/generate-qr", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                qrName,
                type,
                adminId: user._id
            })
        });

        const data = await res.json();

        if (data.message === "QR Generated") {
            alert("QR Generated Successfully 🎉");

            
            await loadQRCodes();

            // start auto-refresh if dynamic
            if (type === "dynamic") {
                startDynamicRefresh(qrName);
            } else {
                stopDynamicRefresh();
            }

            // clear input
            qrNameInput.value = "";
        }

    } catch (err) {
        console.log("Generate QR Error:", err);
    }
}




// returns the active dynamic QR if found

async function loadQRCodes() {
    const user = JSON.parse(localStorage.getItem("user"));
    const container = document.getElementById("qrContainer");

    if (!container) return null;

    try {
        const res = await fetch(
            `http://localhost:5000/api/admin-qr/${user._id}`
        );

        const data = await res.json();

        container.innerHTML = "";

        if (!data || data.length === 0) {
            container.innerHTML = "<p>No QR generated yet</p>";
            return null;
        }

        let dynamicQR = null;

        data.forEach(qr => {
            // active dynamic QR
            if (qr.type === "dynamic") {
                dynamicQR = qr;
            }

            const div = document.createElement("div");
            div.classList.add("qr-card");

            div.innerHTML = `
                <h3>${qr.qrName}</h3>
                <p><strong>Type:</strong> ${qr.type}</p>
                <img src="${qr.qrImage}" width="150" />
                <br><br>
                <button onclick="deleteQR('${qr.qrId}')">Delete</button>
            `;

            container.appendChild(div);
        });

        return dynamicQR;

    } catch (err) {
        console.log("Load QR Error:", err);
        return null;
    }
}



// auto-refreshing

function startDynamicRefresh(qrName) {
    const user = JSON.parse(localStorage.getItem("user"));

    //only one interval exists
    stopDynamicRefresh();

    console.log("Starting dynamic refresh for:", qrName);

    dynamicInterval = setInterval(async () => {
        try {
            const res = await fetch("http://localhost:5000/api/generate-qr", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    qrName,
                    type: "dynamic",
                    adminId: user._id
                })
            });

            const data = await res.json();

            if (data.message === "QR Generated") {
                await loadQRCodes();
            }

        } catch (err) {
            console.log("Dynamic Refresh Error:", err);
        }
    }, 30000);
}



//stop dynamic

function stopDynamicRefresh() {
    if (dynamicInterval) {
        clearInterval(dynamicInterval);
        dynamicInterval = null;
        console.log("Dynamic refresh stopped");
    }
}



// delete

async function deleteQR(qrId) {
    const confirmDelete = confirm(
        "Are you sure you want to delete this QR?"
    );

    if (!confirmDelete) return;

    try {
        const res = await fetch(
            `http://localhost:5000/api/delete-qr/${qrId}`,
            {
                method: "DELETE"
            }
        );

        const data = await res.json();

        alert(data.message);

        // reload QR list
        const dynamicQR = await loadQRCodes();

        // restart or stop interval depending on remaining QR codes
        if (dynamicQR) {
            startDynamicRefresh(dynamicQR.qrName);
        } else {
            stopDynamicRefresh();
        }

    } catch (err) {
        console.log("Delete QR Error:", err);
    }
}