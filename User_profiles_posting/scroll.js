const feedContainer = document.getElementById("feedContainer");
    const posts = JSON.parse(localStorage.getItem("dogPosts")) || [];

    if (posts.length === 0) {
      feedContainer.innerHTML = "<p>No posts yet. Be the first to share!</p>";
    } else {
      posts.forEach(post => {
        const card = document.createElement("div");
        card.className = "post-card";

        card.innerHTML = `
          <img src="${post.photo}" alt="Dog Photo" class="post-photo" />
          <div class="post-info">
            <h3>${post.user}</h3>
            <p>${post.caption}</p>
            <span class="timestamp">${new Date(post.timestamp).toLocaleString()}</span>
          </div>
        `;

        feedContainer.appendChild(card);
      });
    }