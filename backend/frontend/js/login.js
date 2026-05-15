let login_btn = document.querySelector(".login-btn");

login_btn.addEventListener("click", async function () {

    const email = document.getElementById("email").value;
    const password = document.getElementById("pass").value;

    const res = await fetch("https://attendance-system-1ghe.onrender.com/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.message === "Login Successful") {

        localStorage.setItem("user", JSON.stringify(data.user));

        if (data.user.role === "admin") {
            window.location.href = "./admin.html";
        } else {
            window.location.href = "./dashboard.html";
        }

    } else {
        alert(data.message);
    }
});