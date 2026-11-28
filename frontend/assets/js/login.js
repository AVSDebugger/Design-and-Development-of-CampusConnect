
document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");
    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");
    const loginError = document.getElementById("loginError");

    function showMessage(message) {
        loginError.textContent = message;
    }

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

    // Admin Login API
    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = passwordInput.value;
        const rememberMe = document.getElementById("rememberMe").checked;

        showMessage("");

        if (!email || !password) {
            showMessage("Please enter your email and password.");
            return;
        }

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

            const data = await response.json();

            if (!response.ok) {
                showMessage(data.message || "Invalid email or password.");
                return;
            }

            const adminData = {
                admin_id: data.admin_id,
                name: data.name,
                email: email,
                isLoggedIn: true
            };

            if (rememberMe) {
                localStorage.setItem(
                    "campusAdmin",
                    JSON.stringify(adminData)
                );
            } else {
                sessionStorage.setItem(
                    "campusAdmin",
                    JSON.stringify(adminData)
                );
            }

            window.location.href = "dashboard.html";

        } catch (error) {
            console.error("Admin Login Error:", error);
            showMessage("Unable to connect to server. Please try again.");
        }
    });

    // Forgot Password
    document.getElementById("forgotPassword")
        .addEventListener("click", function (event) {
            event.preventDefault();
            alert("Please contact your system administrator to reset your password.");
        });

});
