
// ==================================
// CAMPUSCONNECT - ADMIN LOGIN
// Frontend Demo Authentication Only
// ==================================

const loginForm = document.getElementById("loginForm");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const loginError = document.getElementById("loginError");

// Temporary demo credentials
// Replace this logic with Vidula's Flask API later.
const DEMO_EMAIL = "admin@campusconnect.com";
const DEMO_PASSWORD = "Admin@123";

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

// Login Form
loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = passwordInput.value;
    const rememberMe = document.getElementById("rememberMe").checked;

    loginError.textContent = "";

    if (!email || !password) {
        loginError.textContent = "Please enter your email and password.";
        return;
    }

    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {

        // Temporary frontend demo session
        if (rememberMe) {
            localStorage.setItem("campusAdminLoggedIn", "true");
        } else {
            sessionStorage.setItem("campusAdminLoggedIn", "true");
        }

        window.location.href = "dashboard.html";

    } else {

        loginError.textContent =
            "Invalid email or password. Please try again.";

    }

});

// Forgot Password
document.getElementById("forgotPassword")
    .addEventListener("click", function (event) {

        event.preventDefault();

        alert("Please contact your system administrator to reset your password.");

    });
