
const emailForm = document.getElementById("emailForm");
const otpForm = document.getElementById("otpForm");
const passwordForm = document.getElementById("passwordForm");

const message = document.getElementById("resetMessage");

let resetToken = null;

function showStep(stepId) {
    document.querySelectorAll(".reset-step").forEach(step => {
        step.classList.remove("active");
    });

    document.getElementById(stepId).classList.add("active");
}

function showMessage(text, success = false) {
    message.textContent = text;
    message.style.color = success ? "green" : "red";
}

// STEP 1: SEND OTP
emailForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("resetEmail").value.trim();

    try {
        const response = await fetch("/api/alumni/forgot-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Unable to process request.");
        }

        showMessage(
            data.message || "If the account exists, a verification code has been sent.",
            true
        );

        showStep("otpStep");

    } catch (error) {
        showMessage(error.message);
    }
});

// STEP 2: VERIFY OTP
otpForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("resetEmail").value.trim();
    const otp = document.getElementById("otp").value.trim();

    try {
        const response = await fetch("/api/alumni/verify-reset-otp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, otp })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Invalid or expired OTP.");
        }

        // Backend should return a short-lived reset token.
        resetToken = data.reset_token;

        if (!resetToken) {
            throw new Error("Reset verification could not be completed.");
        }

        showMessage("Email verified successfully!", true);
        showStep("passwordStep");

    } catch (error) {
        showMessage(error.message);
    }
});

// STEP 3: UPDATE PASSWORD
passwordForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const newPassword =
        document.getElementById("newPassword").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    if (newPassword !== confirmPassword) {
        showMessage("Passwords do not match.");
        return;
    }

    if (newPassword.length < 8) {
        showMessage("Password must contain at least 8 characters.");
        return;
    }

    try {
        const response = await fetch("/api/alumni/reset-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                reset_token: resetToken,
                new_password: newPassword
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Unable to update password.");
        }

        showMessage("Password updated successfully! Redirecting...", true);

        passwordForm.reset();

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1800);

    } catch (error) {
        showMessage(error.message);
    }
});
