document.addEventListener("DOMContentLoaded", async function () {

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        window.location.href = "./login.html";
        return;
    }

    const res = await fetch(`https://attendance-system-1ghe.onrender.com/api/admin-attendance/${user._id}`);
    const data = await res.json();

    const container = document.getElementById("attendanceContainer");

    container.innerHTML = "";

    if (data.length === 0) {
        container.innerHTML = "<p>No attendance yet</p>";
        return;
    }

    data.forEach(item => {

    const div = document.createElement("div");
    div.classList.add("att-card");

    const date = new Date(item.scannedAt);

    div.innerHTML = `
        <h3>${item.qrName}</h3>
        <p><strong>Name:</strong> ${item.userName}</p>
        <p><strong>Date:</strong> ${date.toLocaleString()}</p>
    `;

    container.appendChild(div);
});

});