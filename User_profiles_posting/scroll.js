document.addEventListener("DOMContentLoaded", async () => {
  Parse.initialize("fefJHvdGDQOAtrHXUOVnX62hq3s2KB8gUViNUWWP", "klHYFmiUyu9MhG0kVa4U5zjuyVyMD0oWpo33gHfb");
  Parse.serverURL = 'https://parseapi.back4app.com/';

  const feedContainer = document.getElementById("feedContainer");

  const Post = Parse.Object.extend("Post");
  const query = new Parse.Query(Post);
  query.include("user");
  query.descending("createdAt");

  try {
    const posts = await query.find();
    feedContainer.innerHTML = "";

    if (posts.length === 0) {
      feedContainer.innerHTML = "<p>No posts yet. Be the first to share!</p>";
      return;
    }

    for (const post of posts) {
      const photo = post.get("photo");
      const caption = post.get("caption");
      const timeStamp = post.get("timeStamp");
      const user = post.get("user");

      if (!photo || !caption || !timeStamp || !user) continue;

      const username = user.get("username") || "User";
      const profileType = post.get("profileType") || "PetParent";

      // Resolve correct profile ID
      let profileId = "";
      if (profileType === "PetParent") {
        const Parent = Parse.Object.extend("PetParent");
        const pq = new Parse.Query(Parent);
        pq.equalTo("user", user);
        const parentProfile = await pq.first();
        profileId = parentProfile?.id || "";
      } else {
        const Caretaker = Parse.Object.extend("Caretaker");
        const cq = new Parse.Query(Caretaker);
        cq.equalTo("user", user);
        const caretakerProfile = await cq.first();
        profileId = caretakerProfile?.id || "";
      }

      if (!profileId) continue; // Skip if no profile found

      const profileUrl = `../User_profiles_posting/profile.html?id=${profileId}&type=${profileType}`;

      const card = document.createElement("div");
      card.className = "post-card";

      card.innerHTML = `
        <img src="${photo.url()}" alt="Dog Photo" class="post-photo" />
        <div class="post-info">
          <h3><a href="${profileUrl}" target="_blank">${username}</a></h3>
          <p>${caption}</p>
          <p class="timeStamp">${new Date(timeStamp).toLocaleString()}</p>
        </div>
      `;

      feedContainer.appendChild(card);
    }
  } catch (error) {
    console.error("Error loading posts:", error);
    feedContainer.innerHTML = "<p>Something went wrong. Please try again later.</p>";
  }
});
