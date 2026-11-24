
// ==================================
// CAMPUSCONNECT - ADMIN DASHBOARD
// ==================================

// Check demo login session
const isLoggedIn =
    localStorage.getItem("campusAdminLoggedIn") === "true" ||
    sessionStorage.getItem("campusAdminLoggedIn") === "true";

if (!isLoggedIn) {
    window.location.replace("login.html");
}

// Display Current Date
const dateElement = document.getElementById("currentDate");

if (dateElement) {
    dateElement.textContent = new Date().toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );
}

// Logout Function
const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", function () {

    const confirmLogout = confirm("Are you sure you want to logout?");

    if (confirmLogout) {

        localStorage.removeItem("campusAdminLoggedIn");
        sessionStorage.removeItem("campusAdminLoggedIn");

        window.location.replace("login.html");

    }

});

// Sidebar Toggle for Mobile
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");

menuToggle.addEventListener("click", function () {

    sidebar.classList.toggle("show");

});

// Dashboard Navigation
function navigateToPage(page) {

    const pages = {
        alumni: "alumni-list.html",
        verification: "verification.html",
        courses: "course-selection.html",
        batches: "batch-selection.html",
        settings: "#"
    };

    if (pages[page] && pages[page] !== "#") {
        window.location.href = pages[page];
    } else if (page === "settings") {
        alert("Settings page will be developed in a future phase.");
    }

}

// Sidebar Navigation
document.querySelectorAll("[data-page]").forEach(function (item) {

    item.addEventListener("click", function (event) {

        event.preventDefault();

        const page = item.getAttribute("data-page");

        navigateToPage(page);

    });

});

// View All Alumni Buttons
const viewAlumniBtn = document.getElementById("viewAlumniBtn");
const viewAllBtn = document.getElementById("viewAllBtn");

function openAlumniList() {
    window.location.href = "alumni-list.html";
}

if (viewAlumniBtn) {
    viewAlumniBtn.addEventListener("click", openAlumniList);
}

if (viewAllBtn) {
    viewAllBtn.addEventListener("click", openAlumniList);
}

/* =========================================
   ADMIN PROFILE INTERACTION
========================================= */

(function () {

    const profileButton =
        document.getElementById("adminProfileButton");

    const profileDropdown =
        document.getElementById("adminProfileDropdown");

    const profileLogout =
        document.getElementById("profileLogoutBtn");

    if (!profileButton || !profileDropdown) return;

    // Toggle profile dropdown
    profileButton.addEventListener("click", function (event) {

        event.stopPropagation();

        profileDropdown.hidden = !profileDropdown.hidden;

        profileButton.setAttribute(
            "aria-expanded",
            String(!profileDropdown.hidden)
        );

    });

    // Close when clicking outside
    document.addEventListener("click", function (event) {

        if (
            !profileDropdown.contains(event.target) &&
            !profileButton.contains(event.target)
        ) {
            profileDropdown.hidden = true;

            profileButton.setAttribute(
                "aria-expanded",
                "false"
            );
        }

    });

    // Close with Escape key
    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            profileDropdown.hidden = true;

            profileButton.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    });

    // Logout
    if (profileLogout) {

        profileLogout.addEventListener("click", function () {

            if (confirm("Are you sure you want to logout?")) {

                localStorage.removeItem("campusAdminLoggedIn");
                sessionStorage.removeItem("campusAdminLoggedIn");

                window.location.replace("login.html");

            }

        });

    }

})();
