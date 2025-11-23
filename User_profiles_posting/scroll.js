// scroll.js
console.log("🔄 scroll.js loaded");
console.log("Parse available?", typeof Parse !== "undefined"); // debugging

document.addEventListener("DOMContentLoaded", async () => {

  console.log("DOM fully loaded, running scroll.js");

  if (typeof Parse === "undefined") {
    console.error("Parse SDK not loaded!");
    return;
  }

  const currentUser = await Parse.User.currentAsync();

  const feedContainer = document.getElementById("feedContainer");
  const filterButtons = document.querySelectorAll(".content-tab-btn");

  let allPosts = [];
  let parentProfiles = {};
  let caretakerProfiles = {};

  function renderPosts(posts) {
    feedContainer.innerHTML = "";

    if (posts.length === 0) {
      feedContainer.innerHTML = "<p>No posts yet.</p>";
      return;
    }

    posts.forEach(post => {
      // const caption = post.get("caption");
      // const photo = post.get("photo");
      // const timeStamp = post.get("timeStamp");
      // const profileType = post.get("profileType") || "PetParent";

      // const userPointer = post.get("user");
      // let userId = userPointer?.id || post.get("userId");  // fallback to saved ID
      // const username = post.get("username") || "Unknown";

      const caption = post.caption;
      const photo = post.photo;
      const timeStamp = post.timeStamp;
      const profileType = post.profileType;
      const username = post.username;
      const userId = post.userId;
      const profileId = post.profileId;


      if (!photo || !caption || !timeStamp || !userId) {
        console.warn(`⚠️ Skipping malformed post ${post.id}`);
        return;
      }

      const profileUrl = profileId
        ? `../User_profiles_posting/profile.html?id=${profileId}&type=${profileType}`
        : "#";

      const linkAttributes = profileId
        ? 'target="_blank"'
        : 'onclick="return false;" style="pointer-events:none;color:gray;"';

      console.log(`🔗 Built profile URL for ${username}: ${profileUrl}`);

      // Render post card
      const card = document.createElement("div");
      card.className = "post-card";

      card.innerHTML = `
      <img src="${photo}" class="post-photo">
      <div class="post-info">
        <h3>
          <a href="${profileUrl}" ${linkAttributes}>
            ${username}
          </a>
        </h3>
        <p>${caption}</p>
        <p class="timestamp">${new Date(timeStamp).toLocaleString()}</p>
      </div>
    `;

      feedContainer.appendChild(card);
    });
  }

  // Function for filtering posts by their profile type
  function filterPostsByType(type) {
    if (type === "All") {
      renderPosts(allPosts);
      return;
    }
    renderPosts(allPosts.filter(p => p.get("profileType") === type));
  }

  // Event listeners for the filtering tabs
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const type = btn.dataset.filter;
      filterPostsByType(type);
    });
  });

  // Initial load
  try {
    // await loadProfiles();
    // await loadPosts();
    // renderPosts(allPosts);
    const posts = await Parse.Cloud.run("getPostsWithProfiles");
    renderPosts(posts);

  } catch (err) {
    console.error("Error loading feed:", err);
    feedContainer.innerHTML = "<p>Something went wrong.</p>";
  }
});
