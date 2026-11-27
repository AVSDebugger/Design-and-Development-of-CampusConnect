
/* =========================================
   CAMPUSCONNECT - ALUMNI NOTIFICATIONS
   Notification Management
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const notificationList =
        document.getElementById("notificationList");

    const notificationEmpty =
        document.getElementById("notificationEmpty");

    const notificationMessage =
        document.getElementById("notificationMessage");

    const markAllReadBtn =
        document.getElementById("markAllReadBtn");

    const clearAllBtn =
        document.getElementById("clearAllBtn");

    const savePreferencesBtn =
        document.getElementById("savePreferencesBtn");

    if (!notificationList) return;

    // -------------------------------------
    // 1. GET NOTIFICATION ELEMENTS
    // -------------------------------------

    function getNotifications() {
        return Array.from(
            notificationList.querySelectorAll(".notification-item")
        );
    }

    // -------------------------------------
    // 2. DISPLAY MESSAGE
    // -------------------------------------

    function showMessage(message, type) {

        if (!notificationMessage) return;

        notificationMessage.textContent = message;

        notificationMessage.className =
            type === "success"
                ? "form-message text-success"
                : "form-message text-danger";
    }

    // -------------------------------------
    // 3. UPDATE NOTIFICATION STATISTICS
    // -------------------------------------

    function updateStatistics() {

        const notifications = getNotifications();

        const total = notifications.length;

        const unread = notifications.filter(function (item) {
            return item.classList.contains("unread");
        }).length;

        const read = total - unread;

        const totalElement =
            document.getElementById("totalNotifications");

        const unreadElement =
            document.getElementById("unreadNotifications");

        const readElement =
            document.getElementById("readNotifications");

        if (totalElement) {
            totalElement.textContent = total;
        }

        if (unreadElement) {
            unreadElement.textContent = unread;
        }

        if (readElement) {
            readElement.textContent = read;
        }

        if (notificationEmpty) {
            notificationEmpty.style.display =
                total === 0 ? "block" : "none";
        }

    }

    // -------------------------------------
    // 4. MARK NOTIFICATION AS READ
    // -------------------------------------

    function markAsRead(notification) {

        notification.classList.remove("unread");
        notification.classList.add("read");
        notification.dataset.status = "read";

        const readButton =
            notification.querySelector(".mark-read-btn");

        if (readButton) {
            readButton.textContent = "Read";
            readButton.disabled = true;
        }

        updateStatistics();
        applyCurrentFilter();
    }

    // -------------------------------------
    // 5. MARK ALL AS READ
    // -------------------------------------

    if (markAllReadBtn) {

        markAllReadBtn.addEventListener("click", function () {

            getNotifications().forEach(function (notification) {
                markAsRead(notification);
            });

            showMessage(
                "All notifications marked as read.",
                "success"
            );

        });

    }

    // -------------------------------------
    // 6. DELETE INDIVIDUAL NOTIFICATION
    // -------------------------------------

    notificationList.addEventListener("click", function (event) {

        const deleteButton =
            event.target.closest(".delete-notification-btn");

        if (!deleteButton) return;

        const notification =
            deleteButton.closest(".notification-item");

        if (!notification) return;

        notification.remove();

        updateStatistics();
        applyCurrentFilter();

        showMessage(
            "Notification deleted successfully.",
            "success"
        );

    });

    // -------------------------------------
    // 7. INDIVIDUAL MARK AS READ BUTTON
    // -------------------------------------

    notificationList.addEventListener("click", function (event) {

        const readButton =
            event.target.closest(".mark-read-btn");

        if (!readButton || readButton.disabled) return;

        const notification =
            readButton.closest(".notification-item");

        if (notification) {
            markAsRead(notification);

            showMessage(
                "Notification marked as read.",
                "success"
            );
        }

    });

    // -------------------------------------
    // 8. CLEAR ALL NOTIFICATIONS
    // -------------------------------------

    if (clearAllBtn) {

        clearAllBtn.addEventListener("click", function () {

            const confirmed = confirm(
                "Are you sure you want to delete all notifications?"
            );

            if (!confirmed) return;

            notificationList.innerHTML = "";

            updateStatistics();
            applyCurrentFilter();

            showMessage(
                "All notifications have been cleared.",
                "success"
            );

        });

    }

    // -------------------------------------
    // 9. FILTER NOTIFICATIONS
    // -------------------------------------

    const filterButtons =
        document.querySelectorAll(".filter-btn");

    let currentFilter = "all";

    function applyCurrentFilter() {

        const notifications = getNotifications();

        notifications.forEach(function (notification) {

            const isRead =
                notification.classList.contains("read");

            let shouldDisplay = true;

            if (currentFilter === "unread") {
                shouldDisplay = !isRead;
            }

            if (currentFilter === "read") {
                shouldDisplay = isRead;
            }

            notification.style.display =
                shouldDisplay ? "flex" : "none";

        });

        if (notificationEmpty) {

            const visibleCount = notifications.filter(function (item) {
                return item.style.display !== "none";
            }).length;

            notificationEmpty.style.display =
                visibleCount === 0 ? "block" : "none";

        }

    }

    filterButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            filterButtons.forEach(function (item) {
                item.classList.remove("active");
            });

            button.classList.add("active");

            currentFilter = button.dataset.filter || "all";

            applyCurrentFilter();

        });

    });

    // -------------------------------------
    // 10. SAVE NOTIFICATION PREFERENCES
    // -------------------------------------

    const preferenceIds = [
        "eventNotifications",
        "jobNotifications",
        "mentorshipNotifications",
        "communityNotifications"
    ];

    // Load saved preferences
    let savedPreferences = {};

    try {
        savedPreferences = JSON.parse(
            localStorage.getItem("campusconnectNotificationPreferences")
        ) || {};
    } catch (error) {
        console.error("Unable to load preferences:", error);
    }

    preferenceIds.forEach(function (id) {

        const checkbox = document.getElementById(id);

        if (
            checkbox &&
            Object.prototype.hasOwnProperty.call(savedPreferences, id)
        ) {
            checkbox.checked = savedPreferences[id];
        }

    });

    // Save preferences
    if (savePreferencesBtn) {

        savePreferencesBtn.addEventListener("click", function () {

            const preferences = {};

            preferenceIds.forEach(function (id) {

                const checkbox = document.getElementById(id);

                if (checkbox) {
                    preferences[id] = checkbox.checked;
                }

            });

            try {

                localStorage.setItem(
                    "campusconnectNotificationPreferences",
                    JSON.stringify(preferences)
                );

                showMessage(
                    "Notification preferences saved successfully.",
                    "success"
                );

            } catch (error) {

                console.error("Preference saving error:", error);

                showMessage(
                    "Unable to save preferences.",
                    "error"
                );

            }

        });

    }

    // -------------------------------------
    // 11. INITIALIZE NOTIFICATIONS
    // -------------------------------------

    updateStatistics();
    applyCurrentFilter();

    console.log(
        "CampusConnect Notifications page loaded successfully."
    );

});
