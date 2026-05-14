document.addEventListener("DOMContentLoaded", function () {

    console.log("dashboard loaded");

    // Check login
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        alert("Please login first");
        window.location.href = "./login.html";
        return;
    }

    // Mark Attendance → Scanner Page
    document.getElementById("markAttendance").addEventListener("click", function () {
        window.location.href = "./scan.html";
    });

    // View Attendance → List Page
    document.getElementById("viewAttendance").addEventListener("click", function () {
        window.location.href = "./attendance.html";
    });

});