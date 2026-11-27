
/* ==========================================
   CAMPUSCONNECT - ALUMNI PAGES
   Common functionality for Alumni Module
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    // Get logged-in alumni details
    const loggedInAlumni = JSON.parse(
        localStorage.getItem("campusconnectLoggedInAlumni")
    );

    // Protect alumni pages from unauthorized access
    const currentPage = window.location.pathname.split("/").pop();

    const publicPages = ["login.html", "register.html"];

    if (!publicPages.includes(currentPage)) {
        if (!loggedInAlumni || !loggedInAlumni.isLoggedIn) {
            window.location.href = "login.html";
            return;
        }
    }

    // Sidebar elements
    const sidebar = document.getElementById("sidebar");
    const menuToggle = document.getElementById("menuToggle");

    // Toggle sidebar on mobile
    if (menuToggle && sidebar) {
        menuToggle.addEventListener("click", function () {
            sidebar.classList.toggle("active");
        });
    }

    // Close sidebar after clicking a navigation link
    document.querySelectorAll(".sidebar a").forEach(function (link) {
        link.addEventListener("click", function () {
            if (window.innerWidth <= 768 && sidebar) {
                sidebar.classList.remove("active");
            }
        });
    });

    // Highlight active navigation link
    document.querySelectorAll(".sidebar a").forEach(function (link) {
        const linkPage = link.getAttribute("href");

        if (linkPage === currentPage) {
            link.classList.add("active");
        }
    });

    // Generate initials from name
    function getInitials(name) {
        if (!name) return "AL";

        return name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map(word => word.charAt(0).toUpperCase())
            .join("");
    }

    // Update alumni information
    if (loggedInAlumni) {

        const alumniName = loggedInAlumni.name || "Alumni";
        const initials = getInitials(alumniName);

        const nameElements = document.querySelectorAll(
            "#headerUserName, #welcomeName, #summaryName"
        );

        nameElements.forEach(function (element) {
            element.textContent = alumniName;
        });

        // Update avatar initials
        const avatarElements = document.querySelectorAll(
            "#headerAvatar, #profileAvatar"
        );

        avatarElements.forEach(function (avatar) {
            avatar.textContent = initials;
        });
    }

    // Logout functionality
    document.querySelectorAll("#logoutBtn, .logout-btn").forEach(
        function (logoutButton) {

            logoutButton.addEventListener("click", function (event) {
                event.preventDefault();

                const confirmLogout = confirm(
                    "Are you sure you want to logout?"
                );

                if (confirmLogout) {
                    localStorage.removeItem(
                        "campusconnectLoggedInAlumni"
                    );

                    window.location.href = "login.html";
                }
            });
        }
    );

    // Display current date
    const todayDate = document.getElementById("todayDate");

    if (todayDate) {
        todayDate.textContent = new Date().toLocaleDateString(
            "en-IN",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );
    }

});
