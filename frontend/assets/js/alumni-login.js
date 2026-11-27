
/* =========================================
   CAMPUSCONNECT - ALUMNI LOGIN
   Demo Frontend Authentication
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("alumniLoginForm");
    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");
    const loginMessage = document.getElementById("loginMessage");

    if (!loginForm) return;

    // Display messages
    function showMessage(message, type) {
        if (!loginMessage) return;

        loginMessage.textContent = message;
        loginMessage.className = type === "success"
            ? "message-success"
            : "message-error";
    }

    // Login form submission
    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value;

        // Validate empty fields
        if (!email || !password) {
            showMessage("Please enter your email and password.", "error");
            return;
        }

        // Validate email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            showMessage("Please enter a valid email address.", "error");
            return;
        }

        // Retrieve registered alumni details
        let registeredAlumni = null;

        try {
            registeredAlumni = JSON.parse(
                localStorage.getItem("campusconnectAlumni")
            );
        } catch (error) {
            console.error("Error reading alumni data:", error);
        }

        // Check whether an account exists
        if (!registeredAlumni) {
            showMessage(
                "No registered alumni account found. Please register first.",
                "error"
            );
            return;
        }

        // Verify credentials
        const storedEmail = (registeredAlumni.email || "").toLowerCase();

        if (
            storedEmail !== email ||
            registeredAlumni.password !== password
        ) {
            showMessage("Invalid email or password.", "error");
            return;
        }

        // Save logged-in session separately
        const loggedInAlumni = {
            name: registeredAlumni.name,
            email: registeredAlumni.email,
            course: registeredAlumni.course,
            passingYear: registeredAlumni.passingYear,
            isLoggedIn: true
        };

        localStorage.setItem(
            "campusconnectLoggedInAlumni",
            JSON.stringify(loggedInAlumni)
        );

        showMessage("Login successful! Redirecting...", "success");

        // Redirect to dashboard
        setTimeout(function () {
            window.location.href = "dashboard.html";
        }, 1000);

    });

});
