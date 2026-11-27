
/* ==========================================
   CAMPUSCONNECT - ALUMNI REGISTRATION
   Registration form validation and submission
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const registerForm = document.getElementById("alumniRegisterForm");
    const registerMessage = document.getElementById("registerMessage");

    const STORAGE_KEY = "campusconnectAlumni";

    // Display success or error message
    function showMessage(message, type) {

        if (!registerMessage) return;

        registerMessage.textContent = message;
        registerMessage.className = "form-message " + type;
    }

    // Validate email
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Validate Indian mobile number
    function isValidPhone(phone) {
        return /^[6-9]\d{9}$/.test(phone);
    }

    // Validate passing year
    function isValidPassingYear(year) {
        return /^(19|20)\d{2}$/.test(year);
    }

    // Validate registration details
    function validateForm(data) {

        if (data.name.length < 2) {
            return "Please enter your full name.";
        }

        if (!isValidEmail(data.email)) {
            return "Please enter a valid email address.";
        }

        if (!isValidPhone(data.phone)) {
            return "Please enter a valid 10-digit mobile number.";
        }

        if (!data.course) {
            return "Please select your course.";
        }

        if (!isValidPassingYear(data.passingYear)) {
            return "Please enter a valid passing year.";
        }

        if (!data.prn) {
            return "Please enter your PRN number.";
        }

        if (data.password.length < 8) {
            return "Password must contain at least 8 characters.";
        }

        if (data.password !== data.confirmPassword) {
            return "Password and confirm password do not match.";
        }

        return null;
    }

    // Handle registration form submission
    if (registerForm) {

        registerForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const formData = new FormData(registerForm);

            const alumniData = {
                name: (formData.get("name") || "").trim(),
                email: (formData.get("email") || "").trim().toLowerCase(),
                phone: (formData.get("phone") || "").trim(),
                course: (formData.get("course") || "").trim(),
                passingYear: (formData.get("passingYear") || "").trim(),
                prn: (formData.get("prn") || "").trim(),
                password: (formData.get("password") || ""),
                confirmPassword: (formData.get("confirmPassword") || "")
            };

            // Validate form
            const error = validateForm(alumniData);

            if (error) {
                showMessage(error, "error");
                return;
            }

            // Read existing registration
            const existingData = JSON.parse(
                localStorage.getItem(STORAGE_KEY)
            ) || [];

            // Support both old single-object and new array formats
            const alumniList = Array.isArray(existingData)
                ? existingData
                : existingData.email
                    ? [existingData]
                    : [];

            // Check duplicate email
            const emailExists = alumniList.some(function (alumni) {
                return alumni.email === alumniData.email;
            });

            if (emailExists) {
                showMessage(
                    "An account with this email already exists.",
                    "error"
                );
                return;
            }

            // Check duplicate PRN
            const prnExists = alumniList.some(function (alumni) {
                return alumni.prn === alumniData.prn;
            });

            if (prnExists) {
                showMessage(
                    "This PRN number is already registered.",
                    "error"
                );
                return;
            }

            // Create new alumni record
            const newAlumni = {
                name: alumniData.name,
                email: alumniData.email,
                phone: alumniData.phone,
                course: alumniData.course,
                passingYear: alumniData.passingYear,
                prn: alumniData.prn,
                password: alumniData.password,
                registrationStatus: "Pending",
                registeredAt: new Date().toISOString()
            };

            // Save registration
            alumniList.push(newAlumni);

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(alumniList)
            );

            showMessage(
                "Registration submitted successfully! Your account is pending admin verification.",
                "success"
            );

            // Reset form
            registerForm.reset();

            // Redirect to login after a short delay
            setTimeout(function () {
                window.location.href = "login.html";
            }, 2500);

        });

    }

});
