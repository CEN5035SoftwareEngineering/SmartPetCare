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

  // Load profiles
  async function loadProfiles() {
    const PetParent = Parse.Object.extend("PetParent");
    const Caretaker = Parse.Object.extend("Caretaker");

    const parentQuery = new Parse.Query(PetParent);
    parentQuery.include("user");

    const caretakerQuery = new Parse.Query(Caretaker);
    caretakerQuery.include("user");

    const [parentResults, caretakerResults] = await Promise.all([
      parentQuery.find(),
      caretakerQuery.find()
    ]);

    parentProfiles = {};
    caretakerProfiles = {};

    parentResults.forEach(p => {
      const u = p.get("user");
      if (u) parentProfiles[u.id] = p.id;
    });

    caretakerResults.forEach(c => {
      const u = c.get("user");
      if (u) caretakerProfiles[u.id] = c.id;
    });
  }

  // function to load all posts
  async function loadPosts() {
    const Post = Parse.Object.extend("Post");
    const query = new Parse.Query(Post);
    query.include("user");
    query.descending("createdAt");

    const posts = await query.find();

    console.log(`🔍 Found ${posts.length} posts total`);

    posts.forEach(p => {
      console.log(`Post ${p.id}:`, {
        user: p.get("user")?.id || "❌ No user",
        caption: p.get("caption"),
        timeStamp: p.get("timeStamp"),
        photo: p.get("photo") ? "✅" : "❌",
        profileType: p.get("profileType")
      });
    });

    allPosts = posts.filter(p =>
      p.get("caption") &&
      p.get("photo") &&
      p.get("timeStamp")
      // p.get("user")
    );

    console.log(`Filtered valid posts: ${allPosts.length}`);

  }

  // Function for rendering posts
  function renderPosts(posts) {
    feedContainer.innerHTML = "";

    if (posts.length === 0) {
      feedContainer.innerHTML = "<p>No posts yet.</p>";
      return;
    }

    posts.forEach(post => {
      const caption = post.get("caption");
      const photo = post.get("photo");
      const timeStamp = post.get("timeStamp");
      const profileType = post.get("profileType") || "PetParent";

      // New public fields
      let username = post.get("username");
      let userId = post.get("userId");

      // If fields are missing, try pointer fallback
      const userPointer = post.get("user");
      if ((!username || !userId) && userPointer) {
        try {
          username = userPointer.get("username"); // Only works if readable
          userId = userPointer.id;
        } catch (e) {
          console.warn(`🚫 Cannot access user pointer for post ${post.id}`);
        }
      }

      // Fallback - unknown if no username or id
      if (!username) username = "Unknown";
      if (!userId) {
        console.warn(`⚠️ Post ${post.id} missing userId, rendering with limited info.`);
      }

      // Shows any old posts that may have missing fields
      if (!photo || !caption || !timeStamp) {
        console.warn(`⚠️ Skipping malformed post ${post.id}: Missing required content.`);
        return;
      }

      const profileId =
        userId && profileType === "PetParent"
          ? parentProfiles[userId]
          : userId && profileType === "Caretaker"
            ? caretakerProfiles[userId]
            : null;

      const profileUrl = profileId
        ? `../User_profiles_posting/profile.html?id=${profileId}&type=${profileType}`
        : "#";

      const linkAttributes = profileId
        ? 'target="_blank"'
        : 'onclick="return false;" style="pointer-events:none;color:gray;"';


      const card = document.createElement("div");
      card.className = "post-card";

      card.innerHTML = `
      <img src="${photo.url()}" class="post-photo">
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
    await loadProfiles();
    await loadPosts();
    renderPosts(allPosts);
  } catch (err) {
    console.error("Error loading feed:", err);
    feedContainer.innerHTML = "<p>Something went wrong.</p>";
  }
});
