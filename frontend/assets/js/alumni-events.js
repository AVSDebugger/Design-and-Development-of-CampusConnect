
/* =========================================
   CAMPUSCONNECT - ALUMNI EVENTS
   Event Registration and Management
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const eventButtons = document.querySelectorAll(".event-register");
    const eventMessage = document.getElementById("eventMessage");
    const myEventCount = document.getElementById("myEventCount");

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
    // 2. GET EVENT REGISTRATIONS
    // -------------------------------------

    function getRegistrations() {
        try {
            return JSON.parse(
                localStorage.getItem("campusconnectEventRegistrations")
            ) || [];
        } catch (error) {
            console.error("Unable to load event registrations:", error);
            return [];
        }
    }

    function saveRegistrations(registrations) {
        localStorage.setItem(
            "campusconnectEventRegistrations",
            JSON.stringify(registrations)
        );
    }

    // -------------------------------------
    // 3. DISPLAY MESSAGE
    // -------------------------------------

    function showMessage(message, type) {

        if (!eventMessage) return;

        eventMessage.textContent = message;

        eventMessage.className =
            type === "success"
                ? "form-message text-success"
                : "form-message text-danger";
    }

    // -------------------------------------
    // 4. UPDATE REGISTERED EVENT COUNT
    // -------------------------------------

    function updateEventCount() {

        const alumni = getLoggedInAlumni();

        if (!alumni.email) {
            if (myEventCount) {
                myEventCount.textContent = "0";
            }
            return;
        }

        const registrations = getRegistrations();

        const myRegistrations = registrations.filter(function (item) {
            return item.email === alumni.email;
        });

        if (myEventCount) {
            myEventCount.textContent = myRegistrations.length;
        }
    }

    // -------------------------------------
    // 5. CHECK EXISTING REGISTRATIONS
    // -------------------------------------

    function updateButtonStates() {

        const alumni = getLoggedInAlumni();

        if (!alumni.email) return;

        const registrations = getRegistrations();

        eventButtons.forEach(function (button) {

            const eventName = button.dataset.event;

            const alreadyRegistered = registrations.some(function (item) {
                return (
                    item.eventName === eventName &&
                    item.email === alumni.email
                );
            });

            if (alreadyRegistered) {
                button.textContent = "Registered";
                button.disabled = true;
            }

        });
    }

    // -------------------------------------
    // 6. REGISTER FOR EVENT
    // -------------------------------------

    eventButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const alumni = getLoggedInAlumni();

            if (!alumni.email) {
                showMessage(
                    "Please login before registering for an event.",
                    "error"
                );
                return;
            }

            const eventName = button.dataset.event;

            if (!eventName) {
                showMessage(
                    "Event information is missing.",
                    "error"
                );
                return;
            }

            const registrations = getRegistrations();

            const alreadyRegistered = registrations.some(function (item) {
                return (
                    item.eventName === eventName &&
                    item.email === alumni.email
                );
            });

            if (alreadyRegistered) {
                showMessage(
                    "You are already registered for this event.",
                    "error"
                );
                return;
            }

            const confirmed = confirm(
                "Do you want to register for " + eventName + "?"
            );

            if (!confirmed) return;

            const registration = {
                eventName: eventName,
                name: alumni.name || "Alumni",
                email: alumni.email,
                registeredAt: new Date().toISOString(),
                status: "Registered"
            };

            try {

                registrations.push(registration);
                saveRegistrations(registrations);

                button.textContent = "Registered";
                button.disabled = true;

                showMessage(
                    "Successfully registered for " + eventName + "!",
                    "success"
                );

                updateEventCount();

            } catch (error) {

                console.error("Event registration error:", error);

                showMessage(
                    "Unable to register. Please try again.",
                    "error"
                );

            }

        });

    });

    // -------------------------------------
    // 7. INITIALIZE EVENTS PAGE
    // -------------------------------------

    updateEventCount();
    updateButtonStates();

    console.log("CampusConnect Events page loaded successfully.");

});
