// Create new blog post
async function createBlog(title, content) {
  try {
    const response = await fetch(`${API_URL}/blogs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ title, content }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        logout();
      }
      return {
        success: false,
        message: data.message || "Failed to create blog post",
      };
    }

    return { success: true, blog: data.blog };
  } catch (error) {
    console.error("Create blog error:", error);
    return { success: false, message: "Network error. Please try again." };
  }
}

// Update blog post
async function updateBlog(blogId, title, content) {
  try {
    const response = await fetch(`${API_URL}/blogs/${blogId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ title, content }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        logout();
      }
      return {
        success: false,
        message: data.message || "Failed to update blog post",
      };
    }

    return { success: true, blog: data.blog };
  } catch (error) {
    console.error("Update blog error:", error);
    return { success: false, message: "Network error. Please try again." };
  }
}

// Delete blog post
async function deleteBlog(blogId) {
  try {
    const response = await fetch(`${API_URL}/blogs/${blogId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        logout();
      }
      return {
        success: false,
        message: data.message || "Failed to delete blog post",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Delete blog error:", error);
    return { success: false, message: "Network error. Please try again." };
  }
}

// Get all blogs with pagination
async function getAllBlogs(limit = 10, offset = 0) {
  try {
    const response = await fetch(
      `${API_URL}/blogs?limit=${limit}&offset=${offset}`
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch blogs",
      };
    }

    return { success: true, blogs: data.blogs };
  } catch (error) {
    console.error("Get blogs error:", error);
    return { success: false, message: "Network error. Please try again." };
  }
}

// Get blog by ID
async function getBlogById(blogId) {
  try {
    const response = await fetch(`${API_URL}/blogs/${blogId}`);

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch blog",
      };
    }

    return { success: true, blog: data.blog };
  } catch (error) {
    console.error("Get blog error:", error);
    return { success: false, message: "Network error. Please try again." };
  }
}

// Get user blogs
async function getUserBlogs(userId, limit = 10, offset = 0) {
  try {
    const response = await fetch(
      `${API_URL}/users/${userId}?limit=${limit}&offset=${offset}`
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch user blogs",
      };
    }

    return {
      success: true,
      user: data.user,
      blogs: data.blogs,
    };
  } catch (error) {
    console.error("Get user blogs error:", error);
    return { success: false, message: "Network error. Please try again." };
  }
}

// Create blog card HTML
function createBlogCard(blog, isOwner = false) {
  // Truncate content for preview
  const previewContent =
    blog.content.length > 150
      ? blog.content.substring(0, 150) + "..."
      : blog.content;

  // Format date
  const createdDate = new Date(blog.created_at).toLocaleDateString();

  // Create card HTML
  const card = document.createElement("div");
  card.className = "blog-card";
  card.innerHTML = `
      <div class="blog-content">
        <h3 class="blog-title">${blog.title}</h3>
        <p class="blog-text">${previewContent}</p>
        <div class="blog-meta">
          <div class="blog-author">
            <img src="../assets/images/default-avatar.png" alt="${
              blog.username || "User"
            }">
            <span>${blog.username || "Anonymous"}</span>
          </div>
          <div class="blog-actions">
            <button class="like-button" data-blog-id="${blog.blog_id}">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <span class="like-count">${blog.like_count || 0}</span>
            </button>
            ${
              isOwner
                ? `
              <a href="/pages/edit-blog.html?id=${blog.blog_id}" class="edit-link">Edit</a>
              <button class="delete-blog" data-blog-id="${blog.blog_id}">Delete</button>
            `
                : ""
            }
          </div>
        </div>
      </div>
    `;

  return card;
}

// Load blogs into DOM
async function loadBlogs(containerId, limit = 10, offset = 0) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '<div class="loading">Loading posts...</div>';

  const result = await getAllBlogs(limit, offset);

  if (!result.success) {
    container.innerHTML = `<div class="error-message">${result.message}</div>`;
    return;
  }

  if (result.blogs.length === 0) {
    container.innerHTML = '<div class="no-blogs">No blog posts found</div>';
    return;
  }

  // Clear container
  container.innerHTML = "";

  // Get current user for ownership check
  const currentUser = getCurrentUser();

  // Add blogs to container
  result.blogs.forEach((blog) => {
    const isOwner = currentUser && blog.user_id === currentUser.userId;
    const blogCard = createBlogCard(blog, isOwner);
    container.appendChild(blogCard);
  });

  // Setup like buttons
  setupLikeButtons();

  // Setup delete buttons if any
  setupDeleteButtons();
}

// Setup delete buttons
function setupDeleteButtons() {
  const deleteButtons = document.querySelectorAll(".delete-blog");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", async (e) => {
      e.preventDefault();

      if (!confirm("Are you sure you want to delete this blog post?")) {
        return;
      }

      const blogId = button.getAttribute("data-blog-id");
      const result = await deleteBlog(blogId);

      if (result.success) {
        // Remove the blog card from UI
        const blogCard = button.closest(".blog-card");
        blogCard.remove();
      } else {
        alert(result.message);
      }
    });
  });
}
