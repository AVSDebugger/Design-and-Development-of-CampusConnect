
/* =========================================
   CAMPUSCONNECT - ALUMNI DASHBOARD
   Dashboard Data and Functionality
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    // -------------------------------------
    // 1. GET LOGGED-IN ALUMNI
    // -------------------------------------

    let alumni = {};

    try {
        alumni = JSON.parse(
            localStorage.getItem("campusconnectLoggedInAlumni")
        ) || {};
    } catch (error) {
        console.error("Unable to load alumni details:", error);
    }

    // -------------------------------------
    // 2. UPDATE ALUMNI INFORMATION
    // -------------------------------------

    const welcomeName = document.getElementById("welcomeName");
    const summaryName = document.getElementById("summaryName");
    const summaryEmail = document.getElementById("summaryEmail");
    const summaryCourse = document.getElementById("summaryCourse");
    const summaryYear = document.getElementById("summaryYear");
    const summaryRole = document.getElementById("summaryRole");

    if (welcomeName) {
        welcomeName.textContent = alumni.name || "Alumni";
    }

    if (summaryName) {
        summaryName.textContent = alumni.name || "Alumni";
    }

    if (summaryEmail) {
        summaryEmail.textContent = alumni.email || "Not provided";
    }

    if (summaryCourse) {
        summaryCourse.textContent = alumni.course || "Not provided";
    }

    if (summaryYear) {
        summaryYear.textContent = alumni.passingYear || "Not provided";
    }

    if (summaryRole) {
        summaryRole.textContent = alumni.designation ||
            "Alumni Member";
    }

    // -------------------------------------
    // 3. UPDATE PROFILE AVATAR
    // -------------------------------------

    const profileAvatar = document.getElementById("profileAvatar");

    if (profileAvatar) {
        profileAvatar.textContent = getInitials(alumni.name);
    }

    // -------------------------------------
    // 4. GENERATE INITIALS
    // -------------------------------------

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

    // -------------------------------------
    // 5. DASHBOARD STATISTICS
    // -------------------------------------

    const stats = {
        alumniConnections: 120,
        upcomingEvents: 3,
        jobOpportunities: 8
    };

    // Update statistics only if these IDs exist
    const connectionsCount =
        document.getElementById("connectionsCount");

    const eventsCount =
        document.getElementById("eventsCount");

    const jobsCount =
        document.getElementById("jobsCount");

    if (connectionsCount) {
        connectionsCount.textContent = stats.alumniConnections;
    }

    if (eventsCount) {
        eventsCount.textContent = stats.upcomingEvents;
    }

    if (jobsCount) {
        jobsCount.textContent = stats.jobOpportunities;
    }

    // -------------------------------------
    // 6. DISPLAY WELCOME MESSAGE
    // -------------------------------------

    console.log(
        "CampusConnect Alumni Dashboard loaded successfully."
    );

});
