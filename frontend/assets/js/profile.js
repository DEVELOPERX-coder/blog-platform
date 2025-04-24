// Initialize profile page
async function initProfilePage() {
  // Get current user profile
  const result = await getUserProfile();

  if (!result.success) {
    // Handle error
    alert(result.message);
    return;
  }

  const user = result.user;

  // Update profile page elements
  document.getElementById("profile-username").textContent = user.username;
  document.getElementById("profile-email").textContent = user.email;

  if (user.bio) {
    document.getElementById("profile-bio").textContent = user.bio;
  }

  if (user.profileImage) {
    document.getElementById("profile-image").src = user.profileImage;
  }

  // Set form values
  document.getElementById("bio").value = user.bio || "";
  document.getElementById("profile-image-url").value = user.profileImage || "";

  // Load user blogs
  loadUserBlogs(user.userId);

  // Setup edit profile functionality
  setupProfileEdit();
}

// Load user blogs
async function loadUserBlogs(userId) {
  const userBlogsContainer = document.getElementById("user-blogs");
  if (!userBlogsContainer) return;

  userBlogsContainer.innerHTML = '<div class="loading">Loading posts...</div>';

  const result = await getUserBlogs(userId);

  if (!result.success) {
    userBlogsContainer.innerHTML = `<div class="error-message">${result.message}</div>`;
    return;
  }

  if (result.blogs.length === 0) {
    userBlogsContainer.innerHTML =
      '<div class="no-blogs">No blog posts yet</div>';
    return;
  }

  // Clear container
  userBlogsContainer.innerHTML = "";

  // Get current user for ownership check
  const currentUser = getCurrentUser();

  // Add blogs to container
  result.blogs.forEach((blog) => {
    const isOwner = currentUser && blog.user_id === currentUser.userId;
    const blogCard = createBlogCard(blog, isOwner);
    userBlogsContainer.appendChild(blogCard);
  });

  // Setup like buttons
  setupLikeButtons();

  // Setup delete buttons
  setupDeleteButtons();
}

// Setup profile edit functionality
function setupProfileEdit() {
  const editButton = document.getElementById("edit-profile-btn");
  const editForm = document.getElementById("edit-profile-form");
  const cancelButton = document.getElementById("cancel-edit");
  const profileForm = document.getElementById("profile-form");

  // Show/hide edit form
  editButton.addEventListener("click", () => {
    editForm.classList.remove("hidden");
  });

  cancelButton.addEventListener("click", () => {
    editForm.classList.add("hidden");
  });

  // Submit profile update
  profileForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const bio = document.getElementById("bio").value;
    const profileImage = document.getElementById("profile-image-url").value;

    const result = await updateProfile({
      bio,
      profile_image: profileImage,
    });

    if (result.success) {
      // Update UI
      document.getElementById("profile-bio").textContent = bio || "Bio not set";
      if (profileImage) {
        document.getElementById("profile-image").src = profileImage;
      }

      // Hide form
      editForm.classList.add("hidden");
    } else {
      alert(result.message);
    }
  });
}
