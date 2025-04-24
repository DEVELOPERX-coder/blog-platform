// API URL
const API_URL = "/api";

// Check if user is authenticated
function isAuthenticated() {
  return localStorage.getItem("token") !== null;
}

// Get current user data from localStorage
function getCurrentUser() {
  const userString = localStorage.getItem("user");
  return userString ? JSON.parse(userString) : null;
}

// Register a new user
async function register(username, email, password) {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || "Registration failed" };
    }

    // Store token and user data
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    return { success: true };
  } catch (error) {
    console.error("Register error:", error);
    return { success: false, message: "Network error. Please try again." };
  }
}

// Login user
async function login(email, password) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || "Login failed" };
    }

    // Store token and user data
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "Network error. Please try again." };
  }
}

// Logout user
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/index.html";
}

// Get user profile
async function getUserProfile() {
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        logout();
      }
      return { success: false, message: data.message };
    }

    // Update stored user data
    localStorage.setItem("user", JSON.stringify(data.user));

    return { success: true, user: data.user };
  } catch (error) {
    console.error("Get profile error:", error);
    return { success: false, message: "Network error. Please try again." };
  }
}

// Update user profile
async function updateProfile(profileData) {
  try {
    const response = await fetch(`${API_URL}/users/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(profileData),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        logout();
      }
      return { success: false, message: data.message };
    }

    // Get updated profile
    await getUserProfile();

    return { success: true };
  } catch (error) {
    console.error("Update profile error:", error);
    return { success: false, message: "Network error. Please try again." };
  }
}

// Setup logout functionality
document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById("nav-logout");
  if (logoutButton) {
    logoutButton.addEventListener("click", (e) => {
      e.preventDefault();
      logout();
    });
  }

  // Update UI based on auth status
  updateAuthUI();
});

// Update UI based on authentication status
function updateAuthUI() {
  const authRequired = document.querySelectorAll(".auth-required");
  const authNotRequired = document.querySelectorAll(".auth-not-required");

  if (isAuthenticated()) {
    // Show elements that require authentication
    authRequired.forEach((element) => {
      element.classList.remove("hidden");
    });

    // Hide elements that should not be shown when authenticated
    authNotRequired.forEach((element) => {
      element.classList.add("hidden");
    });

    // Update profile link
    const profileLink = document.getElementById("nav-profile");
    if (profileLink) {
      profileLink.href = "/pages/profile.html";
    }
  } else {
    // Hide elements that require authentication
    authRequired.forEach((element) => {
      element.classList.add("hidden");
    });

    // Show elements that should be shown when not authenticated
    authNotRequired.forEach((element) => {
      element.classList.remove("hidden");
    });
  }
}
