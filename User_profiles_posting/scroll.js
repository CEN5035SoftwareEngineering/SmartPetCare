// scroll.js
window.addEventListener("DOMContentLoaded", () => {
  const feed = document.getElementById("postFeed");
  const posts = JSON.parse(localStorage.getItem("dogPosts")) || [];

  if (posts.length === 0) {
    feed.innerHTML = `<p class="no-results">No posts yet! Be the first to share your pet's photo 🐾</p>`;
    return;
  }

  // Show newest posts first
  posts.reverse().forEach(post => {
    const card = document.createElement("div");
    card.classList.add("sitter-card");
    card.innerHTML = `
      <img src="${post.image}" alt="Dog Photo">
      <div>
        <h3>${post.username}</h3>
        <p>Posted on ${new Date(post.timestamp).toLocaleString()}</p>
      </div>
    `;
    feed.appendChild(card);
  });
});
