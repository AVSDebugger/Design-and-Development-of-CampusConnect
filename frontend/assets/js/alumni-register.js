
document.addEventListener("DOMContentLoaded", function () {

    const registerForm = document.getElementById("alumniRegisterForm");
    const registerMessage = document.getElementById("registerMessage");

    function showMessage(message, type) {
        if (!registerMessage) return;

        registerMessage.textContent = message;
        registerMessage.className = "form-message " + type;
    }

    function validateForm(data) {

        if (data.name.length < 2)
            return "Please enter your full name.";

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
            return "Please enter a valid email address.";

        if (!/^[6-9]\d{9}$/.test(data.phone))
            return "Please enter a valid mobile number.";

        if (!data.course)
            return "Please select your course.";

        if (!/^(19|20)\d{2}$/.test(data.passingYear))
            return "Please enter a valid passing year.";

        if (!data.prn)
            return "Please enter your PRN number.";

        if (data.password.length < 8)
            return "Password must contain at least 8 characters.";

        if (data.password !== data.confirmPassword)
            return "Password and confirm password do not match.";

        return null;
    }

    if (registerForm) {

        registerForm.addEventListener("submit", async function (event) {

            event.preventDefault();

            const formData = new FormData(registerForm);

            const alumniData = {
                name: (formData.get("name") || "").trim(),
                email: (formData.get("email") || "").trim().toLowerCase(),
                phone: (formData.get("phone") || "").trim(),
                course: (formData.get("course") || "").trim(),
                passingYear: (formData.get("passingYear") || "").trim(),
                prn: (formData.get("prn") || "").trim(),
                password: formData.get("password") || "",
                confirmPassword: formData.get("confirmPassword") || ""
            };

            const error = validateForm(alumniData);

            if (error) {
                showMessage(error, "error");
                return;
            }

            const submitButton = registerForm.querySelector(
                'button[type="submit"], input[type="submit"]'
            );

            if (submitButton) submitButton.disabled = true;

            showMessage("Submitting registration...", "success");

            try {

                const response = await fetch(
                    "http://127.0.0.1:5000/api/alumni/register",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(alumniData)
                    }
                );

                const result = await response.json();

                if (!response.ok) {
                    showMessage(result.message || "Registration failed.", "error");
                    return;
                }

                showMessage(result.message, "success");

                registerForm.reset();

                setTimeout(function () {
                    window.location.href = "login.html";
                }, 2500);

            } catch (error) {

                console.error("Registration Error:", error);

                showMessage(
                    "Unable to connect to server. Please try again.",
                    "error"
                );

            } finally {

                if (submitButton) submitButton.disabled = false;

            }

        });

    }

});
