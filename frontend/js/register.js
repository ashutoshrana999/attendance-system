

let register_btn = document.querySelector(".register-btn-form");

register_btn.addEventListener("click", async function () {

    const name = document.getElementById("uname").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("pass").value;
    const role = document.getElementById("role").value;

    const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, phone, email, password, role })
    });
    

    const data = await res.json();

    if (data.message === "Registered Successfully") {
        alert("Registration Successful");

        //  to login page
        window.location.href = "./login.html";
    } else {
        alert(data.message);
    }
});