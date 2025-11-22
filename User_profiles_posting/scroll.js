// document.addEventListener("DOMContentLoaded", async () => {
//   Parse.initialize("fefJHvdGDQOAtrHXUOVnX62hq3s2KB8gUViNUWWP", "klHYFmiUyu9MhG0kVa4U5zjuyVyMD0oWpo33gHfb");
//   Parse.serverURL = 'https://parseapi.back4app.com/';

//   const feedContainer = document.getElementById("feedContainer");

//   const Post = Parse.Object.extend("Post");
//   const query = new Parse.Query(Post);
//   query.include("user");
//   query.descending("createdAt");

//   try {
//     const posts = await query.find();

//     console.log("Posts returned:", posts.map(p => ({ // for debugging
//       id: p.id,
//       user: p.get("user")?.id,
//       caption: p.get("caption")
//     })));

//     feedContainer.innerHTML = "";

//     if (posts.length === 0) {
//       feedContainer.innerHTML = "<p>No posts yet. Be the first to share!</p>";
//       return;
//     }

//     for (const post of posts) {
//       const photo = post.get("photo");
//       const caption = post.get("caption");
//       const timeStamp = post.get("timeStamp");
//       const user = post.get("user");

//       if (!photo || !caption || !timeStamp || !user) continue;

//       const username = user.get("username") || "User";
//       const profileType = post.get("profileType") || "PetParent";

//       // Resolve correct profile ID
//       let profileId = "";
//       if (profileType === "PetParent") {
//         const Parent = Parse.Object.extend("PetParent");
//         const pq = new Parse.Query(Parent);
//         pq.equalTo("user", user);
//         const parentProfile = await pq.first();
//         profileId = parentProfile?.id || "";
//       } else {
//         const Caretaker = Parse.Object.extend("Caretaker");
//         const cq = new Parse.Query(Caretaker);
//         cq.equalTo("user", user);
//         const caretakerProfile = await cq.first();
//         profileId = caretakerProfile?.id || "";
//       }

//       if (!profileId) continue; // Skip if no profile found

//       const profileUrl = `../User_profiles_posting/profile.html?id=${profileId}&type=${profileType}`;

//       const card = document.createElement("div");
//       card.className = "post-card";

//       card.innerHTML = `
//         <img src="${photo.url()}" alt="Dog Photo" class="post-photo" />
//         <div class="post-info">
//           <h3><a href="${profileUrl}" target="_blank">${username}</a></h3>
//           <p>${caption}</p>
//           <p class="timeStamp">${new Date(timeStamp).toLocaleString()}</p>
//         </div>
//       `;

//       feedContainer.appendChild(card);
//     }
//   } catch (error) {
//     console.error("Error loading posts:", error);
//     feedContainer.innerHTML = "<p>Something went wrong. Please try again later.</p>";
//   }
// });

document.addEventListener("DOMContentLoaded", async () => {
  Parse.initialize("fefJHvdGDQOAtrHXUOVnX62hq3s2KB8gUViNUWWP", "klHYFmiUyu9MhG0kVa4U5zjuyVyMD0oWpo33gHfb");
  Parse.serverURL = 'https://parseapi.back4app.com/';

  const feedContainer = document.getElementById("feedContainer");
  const filterButtons = document.querySelectorAll(".content-tab-btn");

  let allPosts = [];
  let parentProfiles = {};
  let caretakerProfiles = {};

  // -------------------------------
  // LOAD PROFILES FIRST (batch fetch)
  // -------------------------------
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

  // -------------------------------
  // LOAD POSTS
  // -------------------------------
  async function loadPosts() {
    const Post = Parse.Object.extend("Post");
    const query = new Parse.Query(Post);
    query.include("user");
    query.descending("createdAt");

    const posts = await query.find();
    allPosts = posts.filter(p =>
      p.get("caption") &&
      p.get("photo") &&
      p.get("timeStamp") &&
      p.get("user")
    );
  }

  // -------------------------------
  // RENDER POSTS
  // -------------------------------
  function renderPosts(posts) {
    feedContainer.innerHTML = "";

    if (posts.length === 0) {
      feedContainer.innerHTML = "<p>No posts yet.</p>";
      return;
    }

    posts.forEach(post => {
      const user = post.get("user");
      const caption = post.get("caption");
      const photo = post.get("photo");
      const timeStamp = post.get("timeStamp");
      const profileType = post.get("profileType") || "PetParent";

      const profileId =
        profileType === "PetParent"
          ? parentProfiles[user.id]
          : caretakerProfiles[user.id];

      if (!profileId) return;

      const profileUrl =
        `../User_profiles_posting/profile.html?id=${profileId}&type=${profileType}`;

      const card = document.createElement("div");
      card.className = "post-card";

      card.innerHTML = `
        <img src="${photo.url()}" class="post-photo">
        <div class="post-info">
          <h3><a href="${profileUrl}" target="_blank">${user.get("username")}</a></h3>
          <p>${caption}</p>
          <p class="timestamp">${new Date(timeStamp).toLocaleString()}</p>
        </div>
      `;

      feedContainer.appendChild(card);
    });
  }

  // -------------------------------
  // FILTER HANDLER
  // -------------------------------
  function filterPostsByType(type) {
    if (type === "All") {
      renderPosts(allPosts);
      return;
    }
    renderPosts(allPosts.filter(p => p.get("profileType") === type));
  }

  // -------------------------------
  // SETUP FILTER TAB EVENTS
  // -------------------------------
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const type = btn.dataset.filter;
      filterPostsByType(type);
    });
  });

  // -------------------------------
  // EXECUTE LOAD + INITIAL RENDER
  // -------------------------------
  try {
    await loadProfiles();
    await loadPosts();
    renderPosts(allPosts);
  } catch (err) {
    console.error("Error loading feed:", err);
    feedContainer.innerHTML = "<p>Something went wrong.</p>";
  }
});
