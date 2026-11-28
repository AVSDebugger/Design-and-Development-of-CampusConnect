
/* =========================================
   CAMPUSCONNECT - ADMIN PAGES JAVASCRIPT
   Demo frontend data only
========================================= */

// 1. AUTHENTICATION CHECK

const loggedIn =
    localStorage.getItem("campusAdminLoggedIn") === "true" ||
    sessionStorage.getItem("campusAdminLoggedIn") === "true";

if (!loggedIn) {
    window.location.replace("login.html");
}


// 2. DISPLAY CURRENT DATE

const dateElement = document.getElementById("currentDate");

if (dateElement) {
    dateElement.textContent = new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}


// 3. LOGOUT

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
        if (confirm("Are you sure you want to logout?")) {
            localStorage.removeItem("campusAdminLoggedIn");
            sessionStorage.removeItem("campusAdminLoggedIn");

            window.location.replace("login.html");
        }
    });
}


// 4. MOBILE SIDEBAR

const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");

if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", function () {
        sidebar.classList.toggle("show");
    });
}


// 5. COURSE SELECTION

document.querySelectorAll(".select-course").forEach(button => {
    button.addEventListener("click", function () {
        const selectedCourse = this.dataset.course;

        sessionStorage.setItem("selectedCourse", selectedCourse);

        window.location.href = "batch-selection.html";
    });
});


// 6. DISPLAY SELECTED COURSE

const selectedCourseElement = document.getElementById("selectedCourse");

if (selectedCourseElement) {
    const course = sessionStorage.getItem("selectedCourse");

    selectedCourseElement.textContent = course
        ? `Selected Course: ${course}. Choose a passing year to view alumni.`
        : "No course selected. You can choose a course first.";
}


// 7. BATCH SELECTION

document.querySelectorAll(".batch-card").forEach(button => {
    button.addEventListener("click", function () {
        const selectedYear = this.dataset.year;
        const selectedCourse = sessionStorage.getItem("selectedCourse");

        if (!selectedCourse) {
            alert("Please select a course first.");
            window.location.href = "course-selection.html";
            return;
        }

        sessionStorage.setItem("selectedBatch", selectedYear);

        window.location.href =
            `alumni-list.html?course=${encodeURIComponent(selectedCourse)}&batch=${encodeURIComponent(selectedYear)}`;
    });
});


// 8. ALUMNI SEARCH AND FILTERS

const searchInput = document.getElementById("alumniSearch");
const courseFilter = document.getElementById("courseFilter");
const batchFilter = document.getElementById("batchFilter");
const statusFilter = document.getElementById("statusFilter");

const alumniRows = document.querySelectorAll("#alumniTableBody tr");

function filterAlumni() {
    const search = searchInput?.value.toLowerCase() || "";
    const course = courseFilter?.value || "";
    const batch = batchFilter?.value || "";
    const status = statusFilter?.value || "";

    let visibleCount = 0;

    alumniRows.forEach(row => {
        const name = (row.dataset.name || "").toLowerCase();
        const email = (row.dataset.email || "").toLowerCase();

        const matchesSearch =
            name.includes(search) || email.includes(search);

        const matchesCourse =
            !course || row.dataset.course === course;

        const matchesBatch =
            !batch || row.dataset.batch === batch;

        const matchesStatus =
            !status || row.dataset.status === status;

        const visible =
            matchesSearch &&
            matchesCourse &&
            matchesBatch &&
            matchesStatus;

        row.style.display = visible ? "" : "none";

        if (visible) {
            visibleCount++;
        }
    });

    const countElement = document.getElementById("recordCount");
    const noResults = document.getElementById("noResults");

    if (countElement) {
        countElement.textContent = `${visibleCount} Alumni Records`;
    }

    if (noResults) {
        noResults.hidden = visibleCount !== 0;
    }
}

[searchInput, courseFilter, batchFilter, statusFilter].forEach(element => {
    if (element) {
        element.addEventListener("input", filterAlumni);
        element.addEventListener("change", filterAlumni);
    }
});


// 9. APPLY COURSE AND BATCH FILTERS FROM URL

const query = new URLSearchParams(window.location.search);

if (courseFilter && query.get("course")) {
    courseFilter.value = query.get("course");
}

if (batchFilter && query.get("batch")) {
    batchFilter.value = query.get("batch");
}

if (searchInput || courseFilter || batchFilter || statusFilter) {
    filterAlumni();
}


// 10. ALUMNI PROFILE DATA

const alumniProfiles = {

    1: {
        name: "Rahul Sharma",
        email: "rahul@gmail.com",
        phone: "+91 9876543210",
        location: "Nashik, Maharashtra",
        course: "BCA",
        batch: "2022",
        college: "CampusConnect College",
        status: "Pending",
        designation: "Software Developer",
        company: "ABC Technologies",
        experience: "2 Years"
    },

    2: {
        name: "Ananya Patil",
        email: "ananya@gmail.com",
        phone: "+91 9876543211",
        location: "Pune, Maharashtra",
        course: "B.Sc Computer Science",
        batch: "2023",
        college: "CampusConnect College",
        status: "Verified",
        designation: "Web Developer",
        company: "XYZ Solutions",
        experience: "1 Year"
    },

    3: {
        name: "Sneha Kulkarni",
        email: "sneha@gmail.com",
        phone: "+91 9876543212",
        location: "Mumbai, Maharashtra",
        course: "BCA",
        batch: "2021",
        college: "CampusConnect College",
        status: "Pending",
        designation: "UI Designer",
        company: "Design Studio",
        experience: "3 Years"
    },

    4: {
        name: "Aditya More",
        email: "aditya@gmail.com",
        phone: "+91 9876543213",
        location: "Nashik, Maharashtra",
        course: "B.Sc Information Technology",
        batch: "2020",
        college: "CampusConnect College",
        status: "Verified",
        designation: "IT Analyst",
        company: "Tech Solutions",
        experience: "4 Years"
    },

    5: {
        name: "Priya Gupta",
        email: "priya@gmail.com",
        phone: "+91 9876543214",
        location: "Pune, Maharashtra",
        course: "BCA",
        batch: "2024",
        college: "CampusConnect College",
        status: "Rejected",
        designation: "Fresher",
        company: "Not Available",
        experience: "Fresher"
    },

    6: {
        name: "Neha Joshi",
        email: "neha@gmail.com",
        phone: "+91 9876543215",
        location: "Nashik, Maharashtra",
        course: "MCA",
        batch: "2024",
        college: "CampusConnect College",
        status: "Verified",
        designation: "Software Engineer",
        company: "ABC Technologies",
        experience: "1 Year"
    }

};


// 11. VIEW ALUMNI PROFILE

document.querySelectorAll(".view-profile").forEach(button => {
    button.addEventListener("click", function () {
        const id = this.dataset.id;

        if (alumniProfiles[id]) {
            sessionStorage.setItem(
                "selectedAlumni",
                JSON.stringify(alumniProfiles[id])
            );

            window.location.href = `view-profile.html?id=${id}`;
        }
    });
});


// 12. DISPLAY SELECTED ALUMNI PROFILE

const selectedAlumni = sessionStorage.getItem("selectedAlumni");

if (document.getElementById("profileName")) {
    if (selectedAlumni) {
        const alumni = JSON.parse(selectedAlumni);

        const setText = (id, value) => {
            const element = document.getElementById(id);

            if (element) {
                element.textContent = value ?? "";
            }
        };

        setText("profileName", alumni.name);
        setText("profileCourse", alumni.course);
        setText(
            "profileInitials",
            alumni.name.split(" ").map(n => n[0]).join("")
        );
        setText("profileStatus", alumni.status);

        setText("detailName", alumni.name);
        setText("detailEmail", alumni.email);
        setText("detailPhone", alumni.phone);
        setText("detailLocation", alumni.location);
        setText("detailCourse", alumni.course);
        setText("detailBatch", alumni.batch);
        setText("detailCollege", alumni.college);

        const profileId = new URLSearchParams(location.search).get("id");
        setText("detailId", "CC-" + (profileId || ""));

        setText("detailDesignation", alumni.designation);
        setText("detailCompany", alumni.company);
        setText("detailExperience", alumni.experience);

        const statusElement = document.getElementById("profileStatus");

        if (statusElement) {
            statusElement.className =
                "status " + alumni.status.toLowerCase();
        }

    } else {
        alert("No alumni profile selected.");
        window.location.replace("alumni-list.html");
    }
}


// =========================================
// 13. VERIFICATION ACTIONS AND FILTER
// =========================================

const verificationTableBody =
    document.querySelector("#verificationTable tbody");

const verificationStatusFilter =
    document.getElementById("verificationFilter");


// UPDATE VERIFICATION COUNTS

function updateVerificationCounts() {
    if (!verificationTableBody) return;

    const counts = {
        Pending: 0,
        Verified: 0,
        Rejected: 0
    };

    verificationTableBody.querySelectorAll("tr").forEach(row => {
        const status = row.dataset.status;

        if (Object.prototype.hasOwnProperty.call(counts, status)) {
            counts[status]++;
        }
    });

    const pendingCount = document.getElementById("pendingCount");
    const verifiedCount = document.getElementById("verifiedCount");
    const rejectedCount = document.getElementById("rejectedCount");

    if (pendingCount) {
        pendingCount.textContent = counts.Pending;
    }

    if (verifiedCount) {
        verifiedCount.textContent = counts.Verified;
    }

    if (rejectedCount) {
        rejectedCount.textContent = counts.Rejected;
    }
}


// FILTER VERIFICATION RECORDS

function filterVerification() {
    if (!verificationTableBody) return;

    const selectedStatus = verificationStatusFilter
        ? verificationStatusFilter.value
        : "";

    verificationTableBody.querySelectorAll("tr").forEach(row => {
        const matchesStatus =
            !selectedStatus || row.dataset.status === selectedStatus;

        row.style.display = matchesStatus ? "" : "none";
    });
}


// APPROVE AND REJECT REGISTRATIONS

if (verificationTableBody) {

    verificationTableBody.addEventListener("click", function (event) {

        const button = event.target.closest(
            ".approve-btn, .reject-btn"
        );

        if (!button) return;

        const row = button.closest("tr");

        if (!row) return;

        const newStatus = button.classList.contains("approve-btn")
            ? "Verified"
            : "Rejected";

        const confirmed = confirm(
            `Are you sure you want to ${newStatus.toLowerCase()} this registration?`
        );

        if (!confirmed) return;

        // Update row status
        row.dataset.status = newStatus;

        // Update status column
        if (row.cells[4]) {
            row.cells[4].innerHTML =
                `<span class="status ${newStatus.toLowerCase()}">${newStatus}</span>`;
        }

        // Update action column
        if (row.cells[5]) {
            row.cells[5].innerHTML =
                '<span class="action-complete">Completed</span>';
        }

        // Refresh counts and filters
        updateVerificationCounts();
        filterVerification();

        alert(
            `Registration ${newStatus.toLowerCase()} successfully!`
        );
    });

    updateVerificationCounts();
}


// VERIFICATION STATUS FILTER EVENT

if (verificationStatusFilter) {
    verificationStatusFilter.addEventListener(
        "change",
        filterVerification
    );
}


/* =========================================
   ADMIN PROFILE DROPDOWN
   Shared across all Admin pages
========================================= */

(function () {

    const profileButton = document.getElementById("adminProfileButton");
    const profileDropdown = document.getElementById("adminProfileDropdown");
    const profileLogoutBtn = document.getElementById("profileLogoutBtn");

    // Stop if profile section is not present
    if (!profileButton || !profileDropdown) return;

    // OPEN / CLOSE PROFILE DROPDOWN
    profileButton.addEventListener("click", function (event) {

        event.stopPropagation();

        const isOpening = profileDropdown.hidden;

        profileDropdown.hidden = !isOpening;

        profileButton.setAttribute(
            "aria-expanded",
            String(isOpening)
        );

    });

    // CLOSE WHEN CLICKING OUTSIDE
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

    // CLOSE USING ESCAPE KEY
    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            profileDropdown.hidden = true;

            profileButton.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    });

    // PROFILE LOGOUT
    if (profileLogoutBtn) {

        profileLogoutBtn.addEventListener("click", function () {

            const confirmLogout = confirm(
                "Are you sure you want to logout?"
            );

            if (confirmLogout) {

                localStorage.removeItem("campusAdminLoggedIn");
                sessionStorage.removeItem("campusAdminLoggedIn");

                window.location.replace("login.html");

            }

        });

    }

})();
