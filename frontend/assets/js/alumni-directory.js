
/* =========================================
   CAMPUSCONNECT - ALUMNI DIRECTORY
   Search, Filter and View Alumni
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const directorySearch = document.getElementById("directorySearch");
    const courseFilter = document.getElementById("courseFilter");
    const yearFilter = document.getElementById("yearFilter");
    const directoryGrid = document.getElementById("directoryGrid");
    const directoryEmpty = document.getElementById("directoryEmpty");

    if (!directoryGrid) return;

    // -------------------------------------
    // 1. GET ALUMNI CARDS
    // -------------------------------------

    const alumniCards = Array.from(
        directoryGrid.querySelectorAll(".alumni-card")
    );

    // -------------------------------------
    // 2. SEARCH AND FILTER ALUMNI
    // -------------------------------------

    function filterAlumni() {

        const searchValue = directorySearch
            ? directorySearch.value.trim().toLowerCase()
            : "";

        const selectedCourse = courseFilter
            ? courseFilter.value.toLowerCase()
            : "";

        const selectedYear = yearFilter
            ? yearFilter.value
            : "";

        let visibleCount = 0;

        alumniCards.forEach(function (card) {

            const name = (card.dataset.name || "").toLowerCase();
            const course = (card.dataset.course || "").toLowerCase();
            const year = card.dataset.year || "";
            const info = (card.dataset.info || "").toLowerCase();

            const matchesSearch =
                name.includes(searchValue) ||
                course.includes(searchValue) ||
                info.includes(searchValue);

            const matchesCourse =
                !selectedCourse || course === selectedCourse;

            const matchesYear =
                !selectedYear || year === selectedYear;

            if (matchesSearch && matchesCourse && matchesYear) {
                card.style.display = "";
                visibleCount++;
            } else {
                card.style.display = "none";
            }

        });

        // Display empty state
        if (directoryEmpty) {
            directoryEmpty.style.display =
                visibleCount === 0 ? "block" : "none";
        }

    }

    // -------------------------------------
    // 3. SEARCH EVENT
    // -------------------------------------

    if (directorySearch) {
        directorySearch.addEventListener("input", filterAlumni);
    }

    // -------------------------------------
    // 4. COURSE FILTER EVENT
    // -------------------------------------

    if (courseFilter) {
        courseFilter.addEventListener("change", filterAlumni);
    }

    // -------------------------------------
    // 5. PASSING YEAR FILTER EVENT
    // -------------------------------------

    if (yearFilter) {
        yearFilter.addEventListener("change", filterAlumni);
    }

    // -------------------------------------
    // 6. VIEW ALUMNI PROFILE
    // -------------------------------------

    document.querySelectorAll(".view-alumni-btn").forEach(
        function (button) {

            button.addEventListener("click", function () {

                const card = button.closest(".alumni-card");

                if (!card) return;

                const alumniName = card.dataset.name || "Alumni";

                const alumniInfo = card.dataset.info ||
                    "No additional information available.";

                alert(
                    "Alumni Profile\n\n" +
                    "Name: " + alumniName + "\n\n" +
                    "Details: " + alumniInfo
                );

            });

        }
    );

    // -------------------------------------
    // 7. INITIALIZE DIRECTORY
    // -------------------------------------

    filterAlumni();

    console.log("CampusConnect Alumni Directory loaded.");

});
