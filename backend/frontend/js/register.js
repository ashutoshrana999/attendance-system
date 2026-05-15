console.log("register.js loaded successfully");

let register_btn = document.querySelector(".register-btn-form");

register_btn.addEventListener("click", async function (e) {
    e.preventDefault();

    const name = document.getElementById("uname").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("pass").value.trim();
    const role = document.getElementById("role").value;

    if (!name || !phone || !email || !password || !role) {
        alert("Please fill all fields.");
        return;
    }

    register_btn.disabled = true;
    register_btn.textContent = "Registering...";

    try {
        const res = await fetch("https://attendance-system-1ghe.onrender.com/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                phone,
                email,
                password,
                role
            })
        });

        const data = await res.json();

        if (res.ok && data.message === "Registered Successfully") {
            alert("Registration Successful");
            window.location.href = "./login.html";
        } else {
            alert(data.message || "Registration failed");
        }
    } catch (error) {
        console.error("Registration Error:", error);
        alert("Server error. Please try again later.");
    } finally {
        register_btn.disabled = false;
        register_btn.textContent = "Register";
    }
});