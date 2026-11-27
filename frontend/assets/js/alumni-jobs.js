
/* =========================================
   CAMPUSCONNECT - ALUMNI JOBS
   Job Search, Filter and Apply Functionality
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const jobSearch = document.getElementById("jobSearch");
    const jobType = document.getElementById("jobType");
    const jobListings = document.getElementById("jobListings");
    const jobEmpty = document.getElementById("jobEmpty");
    const jobMessage = document.getElementById("jobMessage");
    const totalJobs = document.getElementById("totalJobs");
    const postJobBtn = document.getElementById("postJobBtn");

    // -------------------------------------
    // 1. GET JOB LISTINGS
    // -------------------------------------

    if (!jobListings) return;

    const jobs = Array.from(
        jobListings.querySelectorAll(".job-listing")
    );

    // -------------------------------------
    // 2. UPDATE TOTAL JOB COUNT
    // -------------------------------------

    function updateJobCount(count) {
        if (totalJobs) {
            totalJobs.textContent = count;
        }
    }

    updateJobCount(jobs.length);

    // -------------------------------------
    // 3. SEARCH AND FILTER JOBS
    // -------------------------------------

    function filterJobs() {

        const searchValue = jobSearch
            ? jobSearch.value.trim().toLowerCase()
            : "";

        const selectedType = jobType
            ? jobType.value.toLowerCase()
            : "";

        let visibleCount = 0;

        jobs.forEach(function (job) {

            const searchableText = (
                job.dataset.search || job.textContent
            ).toLowerCase();

            const jobCategory = (
                job.dataset.type || ""
            ).toLowerCase();

            const matchesSearch =
                searchableText.includes(searchValue);

            const matchesType =
                !selectedType ||
                jobCategory === selectedType;

            if (matchesSearch && matchesType) {
                job.style.display = "";
                visibleCount++;
            } else {
                job.style.display = "none";
            }

        });

        // Update empty state
        if (jobEmpty) {
            jobEmpty.style.display =
                visibleCount === 0 ? "block" : "none";
        }

    }

    if (jobSearch) {
        jobSearch.addEventListener("input", filterJobs);
    }

    if (jobType) {
        jobType.addEventListener("change", filterJobs);
    }

    // -------------------------------------
    // 4. APPLY FOR JOB
    // -------------------------------------

    document.querySelectorAll(".apply-job-btn").forEach(function (button) {

        button.addEventListener("click", function () {

            const jobName = button.dataset.job;

            let alumni = {};

            try {
                alumni = JSON.parse(
                    localStorage.getItem("campusconnectLoggedInAlumni")
                ) || {};
            } catch (error) {
                console.error("Unable to read alumni details:", error);
            }

            if (!alumni.email) {
                showMessage(
                    "Please login before applying for a job.",
                    "error"
                );
                return;
            }

            const confirmed = confirm(
                "Do you want to apply for " + jobName + "?"
            );

            if (!confirmed) return;

            // Store demo application
            let applications = [];

            try {
                applications = JSON.parse(
                    localStorage.getItem("campusconnectJobApplications")
                ) || [];
            } catch (error) {
                console.error("Unable to read applications:", error);
            }

            // Prevent duplicate applications
            const alreadyApplied = applications.some(function (application) {
                return (
                    application.jobName === jobName &&
                    application.email === alumni.email
                );
            });

            if (alreadyApplied) {
                showMessage(
                    "You have already applied for this job.",
                    "error"
                );
                return;
            }

            const application = {
                jobName: jobName,
                name: alumni.name || "Alumni",
                email: alumni.email,
                appliedAt: new Date().toISOString(),
                status: "Applied"
            };

            applications.push(application);

            try {
                localStorage.setItem(
                    "campusconnectJobApplications",
                    JSON.stringify(applications)
                );

                showMessage(
                    "Your demo application for " + jobName +
                    " has been recorded successfully!",
                    "success"
                );

            } catch (error) {
                console.error("Application error:", error);

                showMessage(
                    "Unable to save your application.",
                    "error"
                );
            }

        });

    });

    // -------------------------------------
    // 5. SHARE A JOB OPPORTUNITY
    // -------------------------------------

    if (postJobBtn) {

        postJobBtn.addEventListener("click", function () {

            const title = prompt("Enter the job title:");

            if (!title || !title.trim()) {
                return;
            }

            const company = prompt("Enter the company name:");

            if (!company || !company.trim()) {
                return;
            }

            const location = prompt("Enter the job location:");

            if (!location || !location.trim()) {
                return;
            }

            const job = {
                title: title.trim(),
                company: company.trim(),
                location: location.trim(),
                sharedAt: new Date().toISOString()
            };

            let sharedJobs = [];

            try {
                sharedJobs = JSON.parse(
                    localStorage.getItem("campusconnectSharedJobs")
                ) || [];
            } catch (error) {
                console.error("Unable to read shared jobs:", error);
            }

            sharedJobs.push(job);

            try {
                localStorage.setItem(
                    "campusconnectSharedJobs",
                    JSON.stringify(sharedJobs)
                );

                showMessage(
                    "Job opportunity shared successfully! It is saved as a demo submission.",
                    "success"
                );

            } catch (error) {
                console.error("Unable to save job:", error);

                showMessage(
                    "Unable to share this job opportunity.",
                    "error"
                );
            }

        });

    }

    // -------------------------------------
    // 6. DISPLAY SUCCESS / ERROR MESSAGE
    // -------------------------------------

    function showMessage(message, type) {

        if (!jobMessage) return;

        jobMessage.textContent = message;

        jobMessage.className =
            type === "success"
                ? "form-message text-success"
                : "form-message text-danger";

    }

    console.log("CampusConnect Jobs page loaded successfully.");

});
