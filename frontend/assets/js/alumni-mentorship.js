
/* =========================================
   CAMPUSCONNECT - ALUMNI MENTORSHIP
   Mentor Search and Request Functionality
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const mentorSearch = document.getElementById("mentorSearch");
    const mentorField = document.getElementById("mentorField");
    const mentorGrid = document.getElementById("mentorGrid");
    const mentorEmpty = document.getElementById("mentorEmpty");
    const mentorshipMessage =
        document.getElementById("mentorshipMessage");

    if (!mentorGrid) return;

    const mentorCards = Array.from(
        mentorGrid.querySelectorAll(".mentor-card")
    );

    // -------------------------------------
    // 1. GET LOGGED-IN ALUMNI
    // -------------------------------------

    function getLoggedInAlumni() {
        try {
            return JSON.parse(
                localStorage.getItem("campusconnectLoggedInAlumni")
            ) || {};
        } catch (error) {
            console.error("Unable to load alumni details:", error);
            return {};
        }
    }

    // -------------------------------------
    // 2. DISPLAY MESSAGE
    // -------------------------------------

    function showMessage(message, type) {

        if (!mentorshipMessage) return;

        mentorshipMessage.textContent = message;

        mentorshipMessage.className =
            type === "success"
                ? "form-message text-success"
                : "form-message text-danger";
    }

    // -------------------------------------
    // 3. SEARCH MENTORS
    // -------------------------------------

    function filterMentors() {

        const searchValue = mentorSearch
            ? mentorSearch.value.trim().toLowerCase()
            : "";

        const selectedField = mentorField
            ? mentorField.value.toLowerCase()
            : "";

        let visibleCount = 0;

        mentorCards.forEach(function (card) {

            const name = (card.dataset.name || "").toLowerCase();
            const field = (card.dataset.field || "").toLowerCase();
            const skills = (card.dataset.skills || "").toLowerCase();

            const matchesSearch =
                name.includes(searchValue) ||
                field.includes(searchValue) ||
                skills.includes(searchValue);

            const matchesField =
                !selectedField || field === selectedField;

            if (matchesSearch && matchesField) {
                card.style.display = "";
                visibleCount++;
            } else {
                card.style.display = "none";
            }

        });

        if (mentorEmpty) {
            mentorEmpty.style.display =
                visibleCount === 0 ? "block" : "none";
        }
    }

    // -------------------------------------
    // 4. SEARCH INPUT EVENTS
    // -------------------------------------

    if (mentorSearch) {
        mentorSearch.addEventListener("input", filterMentors);
    }

    if (mentorField) {
        mentorField.addEventListener("change", filterMentors);
    }

    // -------------------------------------
    // 5. GET SAVED MENTORSHIP REQUESTS
    // -------------------------------------

    function getMentorshipRequests() {
        try {
            return JSON.parse(
                localStorage.getItem("campusconnectMentorshipRequests")
            ) || [];
        } catch (error) {
            console.error("Unable to load requests:", error);
            return [];
        }
    }

    // -------------------------------------
    // 6. SEND MENTORSHIP REQUEST
    // -------------------------------------

    document.querySelectorAll(".mentor-request").forEach(
        function (button) {

            button.addEventListener("click", function () {

                const alumni = getLoggedInAlumni();

                if (!alumni.email) {
                    showMessage(
                        "Please login before requesting mentorship.",
                        "error"
                    );
                    return;
                }

                const mentorName = button.dataset.mentor;

                if (!mentorName) {
                    showMessage(
                        "Mentor information is missing.",
                        "error"
                    );
                    return;
                }

                // Prevent requesting yourself
                if (
                    alumni.name &&
                    alumni.name.toLowerCase() === mentorName.toLowerCase()
                ) {
                    showMessage(
                        "You cannot send a mentorship request to yourself.",
                        "error"
                    );
                    return;
                }

                const requests = getMentorshipRequests();

                // Prevent duplicate requests
                const alreadyRequested = requests.some(function (request) {
                    return (
                        request.mentorName === mentorName &&
                        request.email === alumni.email
                    );
                });

                if (alreadyRequested) {
                    showMessage(
                        "You have already requested mentorship from this mentor.",
                        "error"
                    );
                    return;
                }

                const confirmed = confirm(
                    "Send a mentorship request to " + mentorName + "?"
                );

                if (!confirmed) return;

                const request = {
                    mentorName: mentorName,
                    alumniName: alumni.name || "Alumni",
                    email: alumni.email,
                    requestedAt: new Date().toISOString(),
                    status: "Pending"
                };

                try {

                    requests.push(request);

                    localStorage.setItem(
                        "campusconnectMentorshipRequests",
                        JSON.stringify(requests)
                    );

                    button.textContent = "Request Sent";
                    button.disabled = true;

                    showMessage(
                        "Mentorship request sent successfully!",
                        "success"
                    );

                } catch (error) {

                    console.error("Request error:", error);

                    showMessage(
                        "Unable to send request. Please try again.",
                        "error"
                    );

                }

            });

        }
    );

    // -------------------------------------
    // 7. REGISTER AS A MENTOR
    // -------------------------------------

    const becomeMentorBtn =
        document.getElementById("becomeMentorBtn");

    if (becomeMentorBtn) {

        becomeMentorBtn.addEventListener("click", function () {

            const alumni = getLoggedInAlumni();

            if (!alumni.email) {
                showMessage(
                    "Please login before registering as a mentor.",
                    "error"
                );
                return;
            }

            let mentorApplications = [];

            try {
                mentorApplications = JSON.parse(
                    localStorage.getItem("campusconnectMentorApplications")
                ) || [];
            } catch (error) {
                console.error("Unable to load mentor applications:", error);
            }

            const alreadyApplied = mentorApplications.some(function (item) {
                return item.email === alumni.email;
            });

            if (alreadyApplied) {
                showMessage(
                    "You have already submitted a mentor application.",
                    "error"
                );
                return;
            }

            const confirmed = confirm(
                "Would you like to register as a CampusConnect mentor?"
            );

            if (!confirmed) return;

            const application = {
                name: alumni.name || "Alumni",
                email: alumni.email,
                appliedAt: new Date().toISOString(),
                status: "Pending"
            };

            try {

                mentorApplications.push(application);

                localStorage.setItem(
                    "campusconnectMentorApplications",
                    JSON.stringify(mentorApplications)
                );

                showMessage(
                    "Your mentor application has been submitted!",
                    "success"
                );

            } catch (error) {

                console.error("Mentor application error:", error);

                showMessage(
                    "Unable to submit your application.",
                    "error"
                );

            }

        });

    }

    // -------------------------------------
    // 8. INITIALIZE MENTORSHIP PAGE
    // -------------------------------------

    filterMentors();

    console.log("CampusConnect Mentorship page loaded successfully.");

});
