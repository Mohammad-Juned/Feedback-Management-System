const API_BASE_URL = "/api";

// ==================================================
// 1. LOGIN
// ==================================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
loginForm.addEventListener("submit", async function (event) {
event.preventDefault();


    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const message = document.getElementById("loginMessage");
    const button = loginForm.querySelector("button[type='submit']");

    message.textContent = "Signing in...";
    message.className = "message";
    button.disabled = true;

    try {
        const response = await fetch(`${API_BASE_URL}/users/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Login failed.");
        }

        sessionStorage.setItem("userId", data.id);
        sessionStorage.setItem("username", data.username);
        sessionStorage.setItem("userEmail", data.email);

        message.textContent = "Login successful!";
        message.className = "message success";

        setTimeout(function () {
            window.location.href = "feedback.html";
        }, 500);

    } catch (error) {
        message.textContent =
            error.message || "Unable to connect to the server.";
        message.className = "message error";
    } finally {
        button.disabled = false;
    }
});


}

// ==================================================
// 2. USER REGISTRATION
// ==================================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {
registerForm.addEventListener("submit", async function (event) {
event.preventDefault();


    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const message = document.getElementById("registerMessage");
    const button = registerForm.querySelector("button[type='submit']");

    message.textContent = "Creating your account...";
    message.className = "message";
    button.disabled = true;

    try {
        const response = await fetch(`${API_BASE_URL}/users/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Registration failed.");
        }

        message.textContent =
            "Account created successfully! Redirecting to login...";
        message.className = "message success";

        registerForm.reset();

        setTimeout(function () {
            window.location.href = "index.html";
        }, 1500);

    } catch (error) {
        message.textContent =
            error.message || "Unable to connect to the server.";
        message.className = "message error";
    } finally {
        button.disabled = false;
    }
});


}

// ==================================================
// 3. FEEDBACK DASHBOARD
// ==================================================

const feedbackForm = document.getElementById("feedbackForm");

if (feedbackForm) {
const userId = sessionStorage.getItem("userId");
const username = sessionStorage.getItem("username");


const displayUsername = document.getElementById("displayUsername");
const feedbackMessage = document.getElementById("feedbackMessage");
const feedbackStatus = document.getElementById("feedbackStatus");
const feedbackList = document.getElementById("feedbackList");
const feedbackSubmitButton =
    document.getElementById("feedbackSubmitButton");
const formTitle = document.getElementById("formTitle");
const cancelEditButton = document.getElementById("cancelEditButton");
const logoutButton = document.getElementById("logoutButton");
const feedbackFormPanel = document.getElementById("feedbackFormPanel");

let existingFeedback = null;

if (!userId) {
    window.location.href = "index.html";
} else {
    displayUsername.textContent = username || "User";
    loadFeedback();
}

// ---------------- Logout ----------------

logoutButton.addEventListener("click", function () {
    sessionStorage.clear();
    window.location.href = "index.html";
});


// ---------------- Load Feedback ----------------

async function loadFeedback() {
    feedbackList.textContent = "Loading your feedback...";

    try {
        const response = await fetch(
            `${API_BASE_URL}/feedback/user/${userId}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Unable to load feedback.");
        }

        existingFeedback = data.length > 0 ? data[0] : null;

        renderFeedback(data);
        resetFeedbackForm();

    } catch (error) {
        feedbackList.textContent =
            error.message || "Unable to load feedback.";
    }
}


// ---------------- Display Feedback ----------------

function renderFeedback(feedbackItems) {
    feedbackList.replaceChildren();

    if (!feedbackItems || feedbackItems.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "empty-message";
        emptyMessage.textContent =
            "You haven't submitted feedback yet.";

        feedbackList.appendChild(emptyMessage);
        return;
    }

    feedbackItems.forEach(function (item) {
        const card = document.createElement("div");
        card.className = "feedback-card";

        const message = document.createElement("p");
        message.textContent = item.message;

        const date = document.createElement("span");
        date.className = "feedback-date";
        date.textContent = `Submitted on: ${item.date || "Unknown"}`;

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "edit-btn";
        editButton.textContent = "Edit Feedback";

        editButton.addEventListener("click", function () {
            existingFeedback = item;

            feedbackMessage.value = item.message;
            formTitle.textContent = "Edit Your Feedback";
            feedbackSubmitButton.textContent = "Update Feedback";
            cancelEditButton.hidden = false;

            feedbackStatus.textContent = "";
            feedbackStatus.className = "message";

            feedbackFormPanel.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });

        card.append(message, date, editButton);
        feedbackList.appendChild(card);
    });
}


// ---------------- Reset Form ----------------

function resetFeedbackForm() {
    feedbackMessage.value = "";
    formTitle.textContent = "Share Your Feedback";
    feedbackSubmitButton.textContent = "Submit Feedback";
    cancelEditButton.hidden = true;
}


// ---------------- Cancel Editing ----------------

cancelEditButton.addEventListener("click", function () {
    existingFeedback = null;

    feedbackForm.reset();
    feedbackStatus.textContent = "";
    feedbackStatus.className = "message";

    resetFeedbackForm();
});


// ---------------- Submit or Update Feedback ----------------

feedbackForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const message = feedbackMessage.value.trim();

    if (!message) {
        feedbackStatus.textContent = "Please enter your feedback.";
        feedbackStatus.className = "message error";
        return;
    }

    const isEditing = existingFeedback !== null;

    const url = isEditing
        ? `${API_BASE_URL}/feedback/${existingFeedback.id}/user/${userId}`
        : `${API_BASE_URL}/feedback/${userId}`;

    feedbackSubmitButton.disabled = true;
    feedbackStatus.textContent = "Saving feedback...";
    feedbackStatus.className = "message";

    try {
        const response = await fetch(url, {
            method: isEditing ? "PUT" : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Unable to save feedback.");
        }

        feedbackStatus.textContent = isEditing
            ? "Feedback updated successfully!"
            : "Feedback submitted successfully!";

        feedbackStatus.className = "message success";

        existingFeedback = null;
        feedbackForm.reset();
        resetFeedbackForm();

        await loadFeedback();

        // Keep the success message visible after refreshing the list.
        feedbackStatus.textContent = isEditing
            ? "Feedback updated successfully!"
            : "Feedback submitted successfully!";

        feedbackStatus.className = "message success";

    } catch (error) {
        feedbackStatus.textContent =
            error.message || "Unable to connect to the server.";
        feedbackStatus.className = "message error";
    } finally {
        feedbackSubmitButton.disabled = false;
    }
});


}
const adminLogoutButton = document.getElementById("adminLogoutButton");

if (adminLogoutButton) {
const adminStatus = document.getElementById("adminStatus");
const adminFeedbackTable = document.getElementById("adminFeedbackTable");


// Logout
adminLogoutButton.addEventListener("click", function () {
    sessionStorage.clear();
    window.location.href = "index.html";
});

// Load all feedback
loadAllFeedback();

async function loadAllFeedback() {
    adminFeedbackTable.replaceChildren();

    const loadingRow = document.createElement("tr");
    const loadingCell = document.createElement("td");
    loadingCell.colSpan = 6;
    loadingCell.textContent = "Loading feedback...";
    loadingRow.appendChild(loadingCell);
    adminFeedbackTable.appendChild(loadingRow);

    try {
        const response = await fetch(`${API_BASE_URL}/admin/feedback`);
        const feedbackList = await response.json();

        if (!response.ok) {
            throw new Error(
                feedbackList.message || "Unable to load feedback."
            );
        }

        renderAdminFeedback(feedbackList);

    } catch (error) {
        adminFeedbackTable.replaceChildren();

        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 6;
        cell.textContent =
            error.message || "Unable to connect to the server.";

        row.appendChild(cell);
        adminFeedbackTable.appendChild(row);
    }
}

// Display feedback in table
function renderAdminFeedback(feedbackList) {
    adminFeedbackTable.replaceChildren();

    if (!feedbackList.length) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 6;
        cell.textContent = "No feedback has been submitted yet.";

        row.appendChild(cell);
        adminFeedbackTable.appendChild(row);
        return;
    }

    feedbackList.forEach(function (feedback) {
        const row = document.createElement("tr");

        const idCell = document.createElement("td");
        idCell.textContent = feedback.id;

        const usernameCell = document.createElement("td");
        usernameCell.textContent =
            feedback.user?.username || "Unknown";

        const emailCell = document.createElement("td");
        emailCell.textContent =
            feedback.user?.email || "Unknown";

        const messageCell = document.createElement("td");
        messageCell.textContent = feedback.message || "";

        const dateCell = document.createElement("td");
        dateCell.textContent = feedback.date || "Unknown";

        const actionsCell = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "edit-btn";
        editButton.textContent = "Edit";

        editButton.addEventListener("click", function () {
            editFeedback(feedback);
        });

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";
        deleteButton.style.marginLeft = "8px";

        deleteButton.addEventListener("click", function () {
            deleteFeedback(feedback.id);
        });

        actionsCell.append(editButton, deleteButton);

        row.append(
            idCell,
            usernameCell,
            emailCell,
            messageCell,
            dateCell,
            actionsCell
        );

        adminFeedbackTable.appendChild(row);
    });
}

// Edit feedback
async function editFeedback(feedback) {
    const updatedMessage = prompt(
        "Edit feedback:",
        feedback.message
    );

    if (updatedMessage === null) {
        return;
    }

    if (!updatedMessage.trim()) {
        alert("Feedback cannot be empty.");
        return;
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}/admin/feedback/${feedback.id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: updatedMessage.trim()
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Unable to update feedback.");
        }

        adminStatus.textContent = "Feedback updated successfully.";
        adminStatus.className = "message success";

        await loadAllFeedback();

    } catch (error) {
        adminStatus.textContent =
            error.message || "Unable to update feedback.";
        adminStatus.className = "message error";
    }
}

// Delete feedback
async function deleteFeedback(feedbackId) {
    const confirmed = confirm(
        "Are you sure you want to delete this feedback?"
    );

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}/admin/feedback/${feedbackId}`,
            {
                method: "DELETE"
            }
        );

        const result = await response.text();

        if (!response.ok) {
            throw new Error(result || "Unable to delete feedback.");
        }

        adminStatus.textContent = "Feedback deleted successfully.";
        adminStatus.className = "message success";

        await loadAllFeedback();

    } catch (error) {
        adminStatus.textContent =
            error.message || "Unable to delete feedback.";
        adminStatus.className = "message error";
    }
}


}
const adminLoginForm = document.getElementById("adminLoginForm");

if (adminLoginForm) {
adminLoginForm.addEventListener("submit", async function (event) {
event.preventDefault();


    const username = document.getElementById("adminUsername").value.trim();
    const password = document.getElementById("adminPassword").value;
    const message = document.getElementById("adminLoginMessage");
    const button = adminLoginForm.querySelector("button[type='submit']");

    button.disabled = true;
    message.textContent = "Checking credentials...";
    message.className = "message";

    try {
        const response = await fetch(`${API_BASE_URL}/admin/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Admin login failed");
        }

        sessionStorage.setItem("adminLoggedIn", "true");
        sessionStorage.setItem("adminRole", data.role);

        message.textContent = "Login successful!";
        message.className = "message success";

        setTimeout(function () {
            window.location.href = "admin.html";
        }, 500);

    } catch (error) {
        message.textContent =
            error.message || "Unable to connect to the server.";
        message.className = "message error";
    } finally {
        button.disabled = false;
    }
});


}

