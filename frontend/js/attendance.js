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

        div.innerHTML = `
            <h3>${item.qrName}</h3>
            <p>${date.toLocaleString()}</p>
        `;

        container.appendChild(div);
    });

});