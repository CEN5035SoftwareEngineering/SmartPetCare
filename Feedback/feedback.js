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
    // Call the cloud function to safely find any user
    const targetUserData = await Parse.Cloud.run("findUserByUsername", { username: targetUsername });

    if (!targetUserData) {
      alert("No user found with that username.");
      return;
    }

    // Create a pointer manually using the objectId returned
    // const targetUser = {
    //   __type: "Pointer",
    //   className: "_User",
    //   objectId: targetUserData.objectId,
    // };
    const targetUser = new Parse.User();
    targetUser.id = targetUserData.objectId;



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
    feedback.set("targetUserId", targetUser.id); // Added Nov 26 to test for profile populating


    // Setup ACL: author can read/write, public authenticated users can read
    const acl = new Parse.ACL();
    acl.setReadAccess(currentUser, true);        // feedback author
    acl.setWriteAccess(currentUser, true);
    acl.setReadAccess(targetUser, true);         // allow target to read
    acl.setRoleReadAccess("Authenticated", true); // optional: allow all logged-in users
    acl.setPublicReadAccess(true);            // optional: allow public
    feedback.setACL(acl);


    await feedback.save();
    output.textContent = "✅ Feedback submitted successfully!";

    // Clear fields
    document.getElementById("text").value = "";
    document.getElementById("rating").value = "";
    document.getElementById("targetId").value = "";

    await listFeedback(); // Refresh listing automatically
  } catch (err) {
    console.error("❌ Error:", err);
    output.textContent = "❌ " + err.message;
  }
}

async function listFeedback() {
  const feedbackList = document.getElementById("feedbackList");
  feedbackList.innerHTML = "<p>Loading...</p>";

  try {
    const results = await Parse.Cloud.run("getAllFeedback");

    if (results.length === 0) {
      feedbackList.innerHTML = "<p>No feedback yet.</p>";
      return;
    }

    feedbackList.innerHTML = results
      .map((fb) => {
        const stars = "⭐".repeat(fb.rating);
        return `
          <div class="feedback-item">
            <strong>${fb.author}</strong> (${fb.role}) → <em>${fb.target}</em><br>
            <div class="rating">${stars} (${fb.rating}/5)</div>
            <p>${fb.text}</p>
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
// Auto-load feedback on page load
// -----------------------------
document.addEventListener("DOMContentLoaded", listFeedback);
