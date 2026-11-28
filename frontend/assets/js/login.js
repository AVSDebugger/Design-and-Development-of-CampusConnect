
// ==================================
// CAMPUSCONNECT - ADMIN LOGIN
// Flask Backend API Authentication
// ==================================

document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");
    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");
    const loginError = document.getElementById("loginError");

    // Show / Hide Password
    togglePassword.addEventListener("click", function () {

        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            togglePassword.textContent = "Hide";
        } else {
            passwordInput.type = "password";
            togglePassword.textContent = "Show";
        }

    });

    // Admin Login
    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = passwordInput.value;
        const rememberMe = document.getElementById("rememberMe").checked;

        loginError.textContent = "";

        if (!email || !password) {
            loginError.textContent = "Please enter your email and password.";
            return;
        }

        const loginButton = loginForm.querySelector('button[type="submit"]');

        loginButton.disabled = true;
        loginButton.textContent = "Signing in...";

        try {

            const response = await fetch(
                "http://127.0.0.1:5000/api/admin/login",
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
                loginError.textContent =
                    result.message || "Invalid email or password.";
                return;
            }

            // Store basic admin session details
            const adminSession = {
                admin_id: result.admin_id,
                name: result.name,
                email: email,
                isLoggedIn: true
            };

            if (rememberMe) {

                localStorage.setItem(
                    "campusAdminSession",
                    JSON.stringify(adminSession)
                );

            } else {

                sessionStorage.setItem(
                    "campusAdminSession",
                    JSON.stringify(adminSession)
                );

            }

            window.location.href = "dashboard.html";

        } catch (error) {

            console.error("Admin Login Error:", error);

            loginError.textContent =
                "Unable to connect to server. Please try again.";

        } finally {

            loginButton.disabled = false;
            loginButton.innerHTML = 'Sign In <span>→</span>';

        }

    });

    // Forgot Password
    document.getElementById("forgotPassword")
        .addEventListener("click", function (event) {

            event.preventDefault();

            alert(
                "Please contact your system administrator to reset your password."
            );

        });

});
