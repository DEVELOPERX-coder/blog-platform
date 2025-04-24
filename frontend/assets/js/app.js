// Main application JavaScript
document.addEventListener("DOMContentLoaded", () => {
  // Update UI based on authentication
  updateAuthUI();

  // Check if on homepage
  if (
    window.location.pathname === "/" ||
    window.location.pathname === "/index.html"
  ) {
    // Load blog feed
    loadBlogs("blog-list");

    // Setup load more button
    const loadMoreButton = document.getElementById("load-more");
    let currentOffset = 0;
    const limit = 10;

    if (loadMoreButton) {
      loadMoreButton.addEventListener("click", async () => {
        currentOffset += limit;

        // Load more blogs
        const result = await getAllBlogs(limit, currentOffset);

        if (result.success && result.blogs.length > 0) {
          const blogListContainer = document.getElementById("blog-list");
          const currentUser = getCurrentUser();

          // Append new blogs
          result.blogs.forEach((blog) => {
            const isOwner = currentUser && blog.user_id === currentUser.userId;
            const blogCard = createBlogCard(blog, isOwner);
            blogListContainer.appendChild(blogCard);
          });

          // Setup like buttons for new blogs
          setupLikeButtons();

          // Setup delete buttons for new blogs
          setupDeleteButtons();
        }

        // Hide load more button if no more blogs
        if (!result.success || result.blogs.length < limit) {
          loadMoreButton.style.display = "none";
        }
      });
    }
  }

  // Setup profile link
  const profileLink = document.getElementById("nav-profile");
  if (profileLink) {
    profileLink.addEventListener("click", (e) => {
      if (!isAuthenticated()) {
        e.preventDefault();
        window.location.href = "/pages/login.html";
      }
    });
  }
});
