
/* ==========================================
   CAMPUSCONNECT - ALUMNI PROFILE
   Profile loading, editing and saving
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const profileForm = document.getElementById("profileForm");
    const profileMessage = document.getElementById("profileMessage");

    const STORAGE_KEY = "campusconnectAlumniProfile";
    const LOGIN_KEY = "campusconnectLoggedInAlumni";

    // Get logged-in alumni
    let loggedInAlumni = JSON.parse(
        localStorage.getItem(LOGIN_KEY)
    );

    if (!loggedInAlumni || !loggedInAlumni.isLoggedIn) {
        window.location.href = "login.html";
        return;
    }

    // Get saved profile
    let savedProfile = JSON.parse(
        localStorage.getItem(STORAGE_KEY)
    ) || {};

    // Get profile form fields
    const fields = [
        "name",
        "email",
        "phone",
        "location",
        "course",
        "passingYear",
        "prn",
        "designation",
        "organization",
        "experience",
        "skills",
        "bio"
    ];

    // Display profile information
    function loadProfile() {

        fields.forEach(function (field) {

            const input = profileForm?.elements[field];

            if (input) {
                input.value =
                    savedProfile[field] ??
                    loggedInAlumni[field] ??
                    "";
            }

        });

        updateProfileDisplay();
    }

    // Generate initials
    function getInitials(name) {

        if (!name) return "AL";

        return name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map(word => word.charAt(0).toUpperCase())
            .join("");
    }

    // Update profile name and avatar
    function updateProfileDisplay() {

        const name =
            savedProfile.name ||
            loggedInAlumni.name ||
            "Alumni";

        const designation =
            savedProfile.designation || "Alumni Member";

        const profileDisplayName =
            document.getElementById("profileDisplayName");

        const profileDisplayRole =
            document.getElementById("profileDisplayRole");

        const profileAvatar =
            document.getElementById("profileAvatar");

        const headerUserName =
            document.getElementById("headerUserName");

        const headerAvatar =
            document.getElementById("headerAvatar");

        if (profileDisplayName) {
            profileDisplayName.textContent = name;
        }

        if (profileDisplayRole) {
            profileDisplayRole.textContent = designation;
        }

        if (profileAvatar) {
            profileAvatar.textContent = getInitials(name);
        }

        if (headerUserName) {
            headerUserName.textContent = name;
        }

        if (headerAvatar) {
            headerAvatar.textContent = getInitials(name);
        }
    }

    // Display message
    function showMessage(message, type) {

        if (!profileMessage) return;

        profileMessage.textContent = message;
        profileMessage.className = "form-message " + type;

    }

    // Validate profile
    function validateProfile(data) {

        if (!data.name || data.name.trim().length < 2) {
            return "Please enter a valid full name.";
        }

        if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            return "Please enter a valid email address.";
        }

        if (
            data.phone &&
            !/^[6-9]\d{9}$/.test(data.phone.trim())
        ) {
            return "Please enter a valid 10-digit mobile number.";
        }

        if (
            data.passingYear &&
            !/^(19|20)\d{2}$/.test(data.passingYear.trim())
        ) {
            return "Please enter a valid passing year.";
        }

        return null;
    }

    // Save profile
    if (profileForm) {

        profileForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const formData = new FormData(profileForm);
            const updatedProfile = {};

            fields.forEach(function (field) {
                updatedProfile[field] =
                    (formData.get(field) || "").toString().trim();
            });

            // Validate entered details
            const error = validateProfile(updatedProfile);

            if (error) {
                showMessage(error, "error");
                return;
            }

            // Save profile details
            savedProfile = {
                ...savedProfile,
                ...updatedProfile,
                updatedAt: new Date().toISOString()
            };

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(savedProfile)
            );

            // Update logged-in user details
            loggedInAlumni = {
                ...loggedInAlumni,
                name: updatedProfile.name,
                email: updatedProfile.email,
                course: updatedProfile.course,
                passingYear: updatedProfile.passingYear
            };

            localStorage.setItem(
                LOGIN_KEY,
                JSON.stringify(loggedInAlumni)
            );

            updateProfileDisplay();

            showMessage(
                "Your profile has been updated successfully!",
                "success"
            );

        });

    }

    // Load profile when page opens
    loadProfile();

});

