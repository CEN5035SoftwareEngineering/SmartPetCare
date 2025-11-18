// // scroll.js 
// document.addEventListener("DOMContentLoaded", async () => {
//   Parse.initialize("fefJHvdGDQOAtrHXUOVnX62hq3s2KB8gUViNUWWP", "klHYFmiUyu9MhG0kVa4U5zjuyVyMD0oWpo33gHfb");
//   Parse.serverURL = 'https://parseapi.back4app.com/';

//   const feedContainer = document.getElementById("feedContainer");

//   const Post = Parse.Object.extend("Post");
//   const query = new Parse.Query(Post);
//   query.include("user"); // Pull in user pointer
//   query.descending("createdAt");
//   query.limit(50); // cAN BE ADJUSTED - if needed

//   try {
//     const posts = await query.find();

//     if (posts.length === 0) {
//       feedContainer.innerHTML = "<p>No posts yet. Be the first to share!</p>";
//       return;
//     }

//     for (const post of posts) {
//       const photo = post.get("photo");
//       const caption = post.get("caption");
//       const timeStamp = post.get("timeStamp");
//       const user = post.get("user");

//       // Skip broken posts
//       if (!photo || !timeStamp || !caption || !user) continue;

//       const username = user.get("username") || "User";
//       const profileType = post.get("profileType") || "PetParent";

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

//       const profileUrl = `../User_profiles_posting/profile.html?id=${profileId}&type=${profileType}`;

//       const card = document.createElement("div");
//       card.className = "post-card";

//       card.innerHTML = `
//         <img src="${photo.url()}" alt="Dog Photo" class="post-photo" />
//         <div class="post-info">
//           <h3><a href="${profileUrl}" target="_blank">${username}</a></h3>
//           <p>${caption}</p>
//           <span class="timeStamp">${new Date(timeStamp).toLocaleString()}</span>
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
  const Post = Parse.Object.extend("Post");
  const query = new Parse.Query(Post);
  query.include("user");
  query.descending("createdAt");

  try {
    const results = await query.find();
    const container = document.getElementById("postContainer");
    container.innerHTML = "";

    if (results.length === 0) {
      container.innerHTML = "<p>No posts yet.</p>";
      return;
    }

    results.forEach((post) => {
      const photo = post.get("photo");
      const caption = post.get("caption");
      const timeStamp = post.get("timeStamp");
      const user = post.get("user");

      if (!photo || !timeStamp || !caption || !user) return;

      const card = document.createElement("div");
      card.className = "post-card";

      const img = document.createElement("img");
      img.src = photo.url();
      img.alt = "Post";

      const captionP = document.createElement("p");
      captionP.textContent = caption;

      const dateP = document.createElement("p");
      const date = new Date(timeStamp);
      dateP.textContent = date.toLocaleString();

      const link = document.createElement("a");
      const profileType = post.get("profileType") || "PetParent"; // fallback if missing
      link.href = `../User_profiles_posting/profile.html?id=${user.id}&type=${profileType}`;
      link.textContent = "View Profile";

      card.appendChild(img);
      card.appendChild(captionP);
      card.appendChild(dateP);
      card.appendChild(link);

      container.appendChild(card);
    });
  } catch (e) {
    console.error("Error loading posts:", e);
  }
});

