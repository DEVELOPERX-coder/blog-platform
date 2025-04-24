// Like a blog post
async function likeBlog(blogId) {
  try {
    if (!isAuthenticated()) {
      window.location.href = "/pages/login.html";
      return { success: false, message: "Authentication required" };
    }

    const response = await fetch(`${API_URL}/likes/blogs/${blogId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        logout();
      }
      return { success: false, message: data.message || "Failed to like blog" };
    }

    return { success: true, likeCount: data.likeCount };
  } catch (error) {
    console.error("Like blog error:", error);
    return { success: false, message: "Network error. Please try again." };
  }
}

// Unlike a blog post
async function unlikeBlog(blogId) {
  try {
    if (!isAuthenticated()) {
      return { success: false, message: "Authentication required" };
    }

    const response = await fetch(`${API_URL}/likes/blogs/${blogId}`, {
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
        message: data.message || "Failed to unlike blog",
      };
    }

    return { success: true, likeCount: data.likeCount };
  } catch (error) {
    console.error("Unlike blog error:", error);
    return { success: false, message: "Network error. Please try again." };
  }
}

// Check if user has liked a blog
async function getLikeStatus(blogId) {
  try {
    if (!isAuthenticated()) {
      return { success: true, isLiked: false, likeCount: 0 };
    }

    const response = await fetch(`${API_URL}/likes/status/blogs/${blogId}`, {
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
        message: data.message || "Failed to get like status",
      };
    }

    return {
      success: true,
      isLiked: data.isLiked,
      likeCount: data.likeCount,
    };
  } catch (error) {
    console.error("Get like status error:", error);
    return { success: false, message: "Network error. Please try again." };
  }
}

// Setup like buttons
function setupLikeButtons() {
  const likeButtons = document.querySelectorAll(".like-button");

  likeButtons.forEach(async (button) => {
    const blogId = button.getAttribute("data-blog-id");
    const likeCountElement = button.querySelector(".like-count");

    // Check if user has already liked this blog
    if (isAuthenticated()) {
      const status = await getLikeStatus(blogId);
      if (status.success && status.isLiked) {
        button.classList.add("active");
      }
    }

    button.addEventListener("click", async () => {
      if (!isAuthenticated()) {
        window.location.href = "/pages/login.html";
        return;
      }

      if (button.classList.contains("active")) {
        // Unlike
        const result = await unlikeBlog(blogId);
        if (result.success) {
          button.classList.remove("active");
          likeCountElement.textContent = result.likeCount;
        }
      } else {
        // Like
        const result = await likeBlog(blogId);
        if (result.success) {
          button.classList.add("active");
          likeCountElement.textContent = result.likeCount;
        }
      }
    });
  });
}
