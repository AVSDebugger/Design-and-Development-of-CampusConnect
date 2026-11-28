
/* =========================================
   CAMPUSCONNECT - ALUMNI LOGIN
   Backend API Authentication
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("alumniLoginForm");
    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");
    const loginMessage = document.getElementById("loginMessage");

    if (!loginForm) return;

    function showMessage(message, type) {
        if (!loginMessage) return;

        loginMessage.textContent = message;
        loginMessage.className = type === "success"
            ? "message-success"
            : "message-error";
    }

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value;

        if (!email || !password) {
            showMessage("Please enter your email and password.", "error");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            showMessage("Please enter a valid email address.", "error");
            return;
        }

        const submitButton = loginForm.querySelector(
            'button[type="submit"], input[type="submit"]'
        );

        if (submitButton) submitButton.disabled = true;

        showMessage("Checking login details...", "success");

        try {

            const response = await fetch(
                "http://127.0.0.1:5000/api/alumni/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            const result = await response.json();

            if (!response.ok) {
                showMessage(
                    result.message || "Login failed.",
                    "error"
                );
                return;
            }

            // Save basic logged-in user details
            const loggedInAlumni = {
                alumni_id: result.alumni.alumni_id,
                name: result.alumni.name,
                email: result.alumni.email,
                isLoggedIn: true
            };

            localStorage.setItem(
                "campusconnectLoggedInAlumni",
                JSON.stringify(loggedInAlumni)
            );

            showMessage("Login successful! Redirecting...", "success");

            setTimeout(function () {
                window.location.href = "dashboard.html";
            }, 1000);

        } catch (error) {

            console.error("Login Error:", error);

            showMessage(
                "Unable to connect to server. Please try again.",
                "error"
            );

        } finally {

            if (submitButton) submitButton.disabled = false;

        }

    });

});
