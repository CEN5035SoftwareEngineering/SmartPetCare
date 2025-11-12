// -----------------------------
// Initialize Back4App
// -----------------------------
Parse.initialize(
  "fefJHvdGDQOAtrHXUOVnX62hq3s2KB8gUViNUWWP",
  "klHYFmiUyu9MhG0kVa4U5zjuyVyMD0oWpo33gHfb"
);
Parse.serverURL = "https://parseapi.back4app.com/";

console.log("Back4App connected for Feedback page");

// -----------------------------
// Global currentUser
// -----------------------------
let currentUser = null;

(async () => {
  const token = sessionStorage.getItem("sessionToken");
  if (!token) {
    console.warn("No token found — redirecting to login.");
    window.location.href = "../User_login_signup/login.html";
    return;
  }

  try {
    currentUser = await Parse.User.become(token);
    console.log("✅ Authenticated as:", currentUser.getUsername());
  } catch (err) {
    console.error("❌ Invalid token:", err.message);
    sessionStorage.removeItem("sessionToken");
    window.location.href = "../User_login_signup/login.html";
  }
})();

// -----------------------------
// Create feedback
// -----------------------------
async function createFeedback() {
  const targetUsername = document.getElementById("targetId").value.trim();
  const role = document.getElementById("role").value;
  const text = document.getElementById("text").value.trim();
  const rating = Number(document.getElementById("rating").value);
  const output = document.getElementById("createOut");

  if (!currentUser) {
    alert("You must be logged in to submit feedback.");
    return;
  }

  if (!targetUsername || !text || !rating) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    // Find target user
    const userQuery = new Parse.Query(Parse.User);
    userQuery.equalTo("username", targetUsername);
    const targetUser = await userQuery.first({ useMasterKey: false });

    if (!targetUser) {
      alert("No user found with that username.");
      return;
    }

    // Create Feedback object
    const Feedback = Parse.Object.extend("Feedback");
    const feedback = new Feedback();

    feedback.set("author", currentUser);
    feedback.set("target", targetUser);
    feedback.set("text", text);
    feedback.set("role", role);
    feedback.set("rating", rating);

    // Setup ACL: author can read/write, public authenticated users can read
    const acl = new Parse.ACL();
    acl.setReadAccess(currentUser, true);
    acl.setWriteAccess(currentUser, true);
    acl.setPublicReadAccess(false); // deny public
    acl.setRoleReadAccess("Authenticated", true); // allow logged-in users to read
    feedback.setACL(acl);

    await feedback.save();
    output.textContent = "✅ Feedback submitted successfully!";
    document.getElementById("text").value = "";
    document.getElementById("rating").value = "";
    document.getElementById("targetId").value = "";

    await listFeedback(); // Refresh listing automatically
  } catch (err) {
    console.error("❌ Error:", err);
    output.textContent = "❌ " + err.message;
  }
}

// -----------------------------
// List feedback
// -----------------------------
async function listFeedback() {
  const feedbackList = document.getElementById("feedbackList");
  feedbackList.innerHTML = "<p>Loading...</p>";

  try {
    const Feedback = Parse.Object.extend("Feedback");
    const query = new Parse.Query(Feedback);
    query.include("author");
    query.include("target");
    query.descending("createdAt");

    // Enforce ACLs
    const results = await query.find({ useMasterKey: false });

    if (results.length === 0) {
      feedbackList.innerHTML = "<p>No feedback yet.</p>";
      return;
    }

    feedbackList.innerHTML = results
      .map((fb) => {
        const author = fb.get("author");
        const target = fb.get("target");
        const authorName = author ? author.get("username") : "Anonymous";
        const targetName = target ? target.get("username") : "Unknown";
        const role = fb.get("role") || "";
        const rating = fb.get("rating") || 0;
        const text = fb.get("text") || "";
        const stars = "⭐".repeat(rating);

        return `
          <div class="feedback-item">
            <strong>${authorName}</strong> (${role}) → <em>${targetName}</em><br>
            <div class="rating">${stars} (${rating}/5)</div>
            <p>${text}</p>
            <small>${new Date(fb.createdAt).toLocaleString()}</small>
          </div>
        `;
      })
      .join("");
  } catch (err) {
    console.error("❌ Error listing feedback:", err);
    feedbackList.innerHTML = `<p style="color:red;">${err.message}</p>`;
  }
}

// -----------------------------
// Optional: event listeners
// -----------------------------
// document.getElementById("submitFeedback").addEventListener("click", createFeedback);
// document.addEventListener("DOMContentLoaded", listFeedback);

// // Initialize Back4App
// Parse.initialize("fefJHvdGDQOAtrHXUOVnX62hq3s2KB8gUViNUWWP", "klHYFmiUyu9MhG0kVa4U5zjuyVyMD0oWpo33gHfb");
// Parse.serverURL = "https://parseapi.back4app.com/";

// console.log("Back4App connected for Feedback page");
// (async () => {
//   const token = sessionStorage.getItem("sessionToken");
//   if (!token) {
//     console.warn("No token found — redirecting to login.");
//     window.location.href = "../User_login_signup/login.html";
//     return;
//   }

//   try {
//     const user = await Parse.User.become(token);
//     console.log("✅ Authenticated as:", user.getUsername());
//   } catch (err) {
//     console.error("❌ Invalid token:", err.message);
//     sessionStorage.removeItem("sessionToken");
//     window.location.href = "../User_login_signup/login.html";
//   }
// })();

// // Create feedback
// async function createFeedback() {
//   const targetUsername = document.getElementById("targetId").value.trim();
//   const role = document.getElementById("role").value;
//   const text = document.getElementById("text").value.trim();
//   const rating = Number(document.getElementById("rating").value);
//   const output = document.getElementById("createOut");

//   if (!targetUsername || !text || !rating) {
//     alert("Please fill in all fields.");
//     return;
//   }

//   try {
//     const author = Parse.User.current();
//     if (!author) {
//       alert("You must be logged in to submit feedback.");
//       return;
//     }

//     // Find the target user by username
//     const userQuery = new Parse.Query(Parse.User);
//     userQuery.equalTo("username", targetUsername);
//     const targetUser = await userQuery.first();

//     if (!targetUser) {
//       alert("No user found with that username.");
//       return;
//     }

//     const Feedback = Parse.Object.extend("Feedback");
//     const feedback = new Feedback();

//     feedback.set("author", author);
//     feedback.set("target", targetUser); // Pointer to _User
//     feedback.set("text", text);
//     feedback.set("role", role);
//     feedback.set("rating", rating);

//     await feedback.save();
//     output.textContent = "✅ Feedback submitted successfully!";
//     document.getElementById("text").value = "";
//     document.getElementById("rating").value = "";
//     document.getElementById("targetId").value = "";

//     await listFeedback(); // Refresh listing automatically
//   } catch (err) {
//     console.error("❌ Error:", err);
//     output.textContent = "❌ " + err.message;
//   }
// }

// // List feedback
// async function listFeedback() {
//   const feedbackList = document.getElementById("feedbackList");
//   feedbackList.innerHTML = "<p>Loading...</p>";

//   try {
//     const Feedback = Parse.Object.extend("Feedback");
//     const query = new Parse.Query(Feedback);
//     query.include("author");
//     query.include("target");
//     query.descending("createdAt");

//     const results = await query.find();

//     if (results.length === 0) {
//       feedbackList.innerHTML = "<p>No feedback yet.</p>";
//       return;
//     }

//     feedbackList.innerHTML = results
//       .map((fb) => {
//         const author = fb.get("author");
//         const target = fb.get("target");
//         const authorName = author ? author.get("username") : "Anonymous";
//         const targetName = target ? target.get("username") : "Unknown";
//         const role = fb.get("role") || "";
//         const rating = fb.get("rating") || 0;
//         const text = fb.get("text") || "";
//         const stars = "⭐".repeat(rating);

//         return `
//           <div class="feedback-item">
//             <strong>${authorName}</strong> (${role}) → <em>${targetName}</em><br>
//             <div class="rating">${stars} (${rating}/5)</div>
//             <p>${text}</p>
//             <small>${new Date(fb.createdAt).toLocaleString()}</small>
//           </div>
//         `;
//       })
//       .join("");
//   } catch (err) {
//     console.error("❌ Error listing feedback:", err);
//     feedbackList.innerHTML = `<p style="color:red;">${err.message}</p>`;
//   }
// }