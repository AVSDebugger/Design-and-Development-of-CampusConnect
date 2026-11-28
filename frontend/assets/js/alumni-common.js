
/* =========================================
   CAMPUSCONNECT - ALUMNI COMMON JS
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    // 1. Sidebar Toggle
    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");

    if (menuToggle && sidebar) {
        menuToggle.addEventListener("click", function () {
            sidebar.classList.toggle("open");
        });

        document.addEventListener("click", function (event) {
            if (
                window.innerWidth <= 1000 &&
                !sidebar.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                sidebar.classList.remove("open");
            }
        });
    }

    // 2. Display Current Date
    const todayDate = document.getElementById("todayDate");

    if (todayDate) {
        todayDate.textContent = new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    }

    // 3. Get Logged-in Alumni
    let alumniUser = {};

    try {
        alumniUser = JSON.parse(
            localStorage.getItem("campusconnectLoggedInAlumni")
        ) || {};
    } catch (error) {
        console.error("Unable to read alumni details:", error);
    }

    const alumniName = alumniUser.name || "Alumni";

    // 4. Update Header
    const headerUserName = document.getElementById("headerUserName");
    const headerAvatar = document.getElementById("headerAvatar");

    if (headerUserName) {
        headerUserName.textContent = alumniName;
    }

    if (headerAvatar) {
        headerAvatar.textContent = getInitials(alumniName);
    }

    // 5. Update Dashboard Welcome Name
    const welcomeName = document.getElementById("welcomeName");

    if (welcomeName) {
        welcomeName.textContent = alumniName;
    }

    // 6. Update Profile Summary
    const summaryName = document.getElementById("summaryName");
    const summaryEmail = document.getElementById("summaryEmail");
    const profileAvatar = document.getElementById("profileAvatar");

    if (summaryName) {
        summaryName.textContent = alumniName;
    }

    if (summaryEmail && alumniUser.email) {
        summaryEmail.textContent = alumniUser.email;
    }

    if (profileAvatar) {
        profileAvatar.textContent = getInitials(alumniName);
    }

    // 7. Logout
    document.querySelectorAll(".logout-link").forEach(function (link) {

        link.addEventListener("click", function (event) {
            event.preventDefault();

            if (confirm("Are you sure you want to logout?")) {
                localStorage.removeItem("campusconnectLoggedInAlumni");
                window.location.href = "login.html";
            }
        });

    });

    // 8. Generate Initials
    function getInitials(name) {
        if (!name || typeof name !== "string") {
            return "A";
        }

        return name.trim()
            .split(/\s+/)
            .slice(0, 2)
            .map(word => word.charAt(0).toUpperCase())
            .join("");
    }

});
