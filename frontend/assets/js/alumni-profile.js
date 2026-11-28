
/* ==========================================
   CAMPUSCONNECT - ALUMNI PROFILE
   Profile loading, editing and saving
   Multiple Work Experience
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const profileForm = document.getElementById("profileForm");
    const profileMessage = document.getElementById("profileMessage");

    const experienceList = document.getElementById("experienceList");
    const addExperienceBtn = document.getElementById("addExperienceBtn");

    const STORAGE_KEY = "campusconnectAlumniProfile";
    const LOGIN_KEY = "campusconnectLoggedInAlumni";

    // Get logged-in alumni
    let loggedInAlumni = JSON.parse(
        localStorage.getItem(LOGIN_KEY)
    );

    if (!loggedInAlumni || !loggedInAlumni.isLoggedIn) {
        window.location.href = "login.html";
        return;
    }

    // Get saved profile
    let savedProfile = JSON.parse(
        localStorage.getItem(STORAGE_KEY)
    ) || {};

    // Normal profile fields
    const fields = [
        "name",
        "email",
        "phone",
        "location",
        "course",
        "passingYear",
        "prn",
        "skills",
        "bio"
    ];

    // Generate initials
    function getInitials(name) {

        if (!name) return "AL";

        return name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map(word => word.charAt(0).toUpperCase())
            .join("");
    }

    // Update profile display
    function updateProfileDisplay() {

        const name =
            savedProfile.name ||
            loggedInAlumni.name ||
            "Alumni";

        const firstExperience =
            savedProfile.workExperiences?.[0] || {};

        const designation =
            firstExperience.designation ||
            savedProfile.designation ||
            "Alumni Member";

        const profileDisplayName =
            document.getElementById("profileDisplayName");

        const profileDisplayRole =
            document.getElementById("profileDisplayRole");

        const profileAvatar =
            document.getElementById("profileAvatar");

        const headerUserName =
            document.getElementById("headerUserName");

        const headerAvatar =
            document.getElementById("headerAvatar");

        if (profileDisplayName) {
            profileDisplayName.textContent = name;
        }

        if (profileDisplayRole) {
            profileDisplayRole.textContent = designation;
        }

        if (profileAvatar) {
            profileAvatar.textContent = getInitials(name);
        }

        if (headerUserName) {
            headerUserName.textContent = name;
        }

        if (headerAvatar) {
            headerAvatar.textContent = getInitials(name);
        }
    }

    // Show message
    function showMessage(message, type) {

        if (!profileMessage) return;

        profileMessage.textContent = message;
        profileMessage.className = "form-message " + type;
    }

    // Create experience card
    const firstCard = experienceList?.querySelector(".experience-card");

    function createExperienceCard(data = {}) {

        const card = firstCard.cloneNode(true);

        // Clear and fill experience fields
        card.querySelectorAll("[data-field]").forEach(function (input) {

            const field = input.dataset.field;

            if (input.type === "checkbox") {
                input.checked = data[field] === true;
            } else {
                input.value = data[field] || "";
            }

        });

        // Add remove button
        const header = card.querySelector(".experience-card-header");

        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "remove-experience";
        removeBtn.textContent = "Remove";

        header.appendChild(removeBtn);

        updateExperienceCard(card);

        return card;
    }

    // Update experience card heading and date
    function updateExperienceCard(card) {

        const cards = experienceList.querySelectorAll(".experience-card");

        cards.forEach(function (item, index) {

            const heading = item.querySelector("h3");

            if (heading) {
                heading.textContent = "Experience " + (index + 1);
            }

            const currentCheckbox =
                item.querySelector('[data-field="current"]');

            const endDate =
                item.querySelector('[data-field="endDate"]');

            if (currentCheckbox && endDate) {
                endDate.disabled = currentCheckbox.checked;
                if (currentCheckbox.checked) {
                    endDate.value = "";
                }
            }

        });
    }

    // Add new experience
    if (addExperienceBtn && experienceList && firstCard) {

        addExperienceBtn.addEventListener("click", function () {

            const newCard = createExperienceCard();

            experienceList.appendChild(newCard);

            updateExperienceCard(newCard);
        });

        // Remove experience
        experienceList.addEventListener("click", function (event) {

            if (event.target.classList.contains("remove-experience")) {

                const cards =
                    experienceList.querySelectorAll(".experience-card");

                if (cards.length > 1) {
                    event.target.closest(".experience-card").remove();
                    updateExperienceCard();
                } else {
                    showMessage(
                        "At least one experience section is required.",
                        "error"
                    );
                }
            }
        });

        // Current working checkbox
        experienceList.addEventListener("change", function (event) {

            if (event.target.dataset.field === "current") {
                updateExperienceCard();
            }
        });
    }

    // Collect experience details
    function collectExperiences() {

        const experiences = [];

        experienceList.querySelectorAll(".experience-card").forEach(
            function (card) {

                const experience = {};

                card.querySelectorAll("[data-field]").forEach(
                    function (input) {

                        const field = input.dataset.field;

                        experience[field] =
                            input.type === "checkbox"
                                ? input.checked
                                : input.value.trim();
                    }
                );

                const hasData = Object.values(experience).some(
                    value => value !== "" && value !== false
                );

                if (hasData) {
                    experiences.push(experience);
                }
            }
        );

        return experiences;
    }

    // Load experience details
    function loadExperiences() {

        if (!experienceList || !firstCard) return;

        const experiences = savedProfile.workExperiences || [];

        experienceList.innerHTML = "";

        if (experiences.length > 0) {

            experiences.forEach(function (experience) {
                experienceList.appendChild(
                    createExperienceCard(experience)
                );
            });

        } else {

            // Support old saved profile data
            const oldExperience = {
                company: savedProfile.organization || "",
                designation: savedProfile.designation || "",
                description: savedProfile.experience || ""
            };

            experienceList.appendChild(
                createExperienceCard(oldExperience)
            );
        }

        updateExperienceCard();
    }

    // Load normal profile fields
    function loadProfile() {

        fields.forEach(function (field) {

            const input = profileForm.elements[field];

            if (input) {
                input.value =
                    savedProfile[field] ??
                    loggedInAlumni[field] ??
                    "";
            }
        });

        loadExperiences();
        updateProfileDisplay();
    }

    // Validate profile
    function validateProfile(data) {

        if (!data.name || data.name.trim().length < 2) {
            return "Please enter a valid full name.";
        }

        if (
            !data.email ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
        ) {
            return "Please enter a valid email address.";
        }

        if (
            data.phone &&
            !/^[6-9]\d{9}$/.test(data.phone.trim())
        ) {
            return "Please enter a valid 10-digit mobile number.";
        }

        if (
            data.passingYear &&
            !/^(19|20)\d{2}$/.test(data.passingYear.trim())
        ) {
            return "Please enter a valid passing year.";
        }

        return null;
    }

    // Save profile
    if (profileForm) {

        profileForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const formData = new FormData(profileForm);
            const updatedProfile = {};

            fields.forEach(function (field) {

                updatedProfile[field] =
                    (formData.get(field) || "").toString().trim();
            });

            // Validate profile
            const error = validateProfile(updatedProfile);

            if (error) {
                showMessage(error, "error");
                return;
            }

            // Collect multiple work experiences
            const workExperiences = collectExperiences();

            // Save profile details
            savedProfile = {
                ...savedProfile,
                ...updatedProfile,
                workExperiences: workExperiences,

                // Keep old fields for compatibility
                designation: workExperiences[0]?.designation || "",
                organization: workExperiences[0]?.company || "",
                experience: workExperiences[0]?.description || "",

                updatedAt: new Date().toISOString()
            };

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(savedProfile)
            );

            // Update logged-in alumni
            loggedInAlumni = {
                ...loggedInAlumni,
                name: updatedProfile.name,
                email: updatedProfile.email,
                course: updatedProfile.course,
                passingYear: updatedProfile.passingYear
            };

            localStorage.setItem(
                LOGIN_KEY,
                JSON.stringify(loggedInAlumni)
            );

            updateProfileDisplay();

            showMessage(
                "Your profile has been updated successfully!",
                "success"
            );

        });

    }

    // Reset form and reload saved information
    if (profileForm) {

        profileForm.addEventListener("reset", function () {

            setTimeout(function () {
                loadProfile();
                showMessage("", "");
            }, 0);

        });
    }

    // Load profile when page opens
    loadProfile();

});
