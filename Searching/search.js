// search.js
//Debugging code:

// console.log("Parse initialized?", typeof Parse !== "undefined");
// console.log("Current user:", Parse.User.current());
// Restore the session manually
// const token = sessionStorage.getItem("sessionToken");
// if (token) {
//   const user = await Parse.User.become(token);
//   console.log("Authenticated via Back4App session:", user.getUsername());
// } else {
//   console.warn("No token found, redirecting to login");
// }
// Code to check if the user is currently logged in
// document.addEventListener("DOMContentLoaded", async () => {
//   const currentUser = Parse.User.current();
//   if (currentUser) {
//     console.log("✅ Logged in as:", currentUser.getUsername(), "(", currentUser.id, ")");
//   } else {
//     console.log("⚠️ No user is currently logged in.");
//   }
// });

//CODE THAT GOES EITHER IN THIS FILE OR IN THE BACK4APP--not SURE WHICH
// const acl = new Parse.ACL();
// acl.setReadAccess(currentUser, true);         // owner can read
// acl.setWriteAccess(currentUser, true);        // owner can write
// acl.setPublicReadAccess(false);               // deny public
// acl.setRoleReadAccess("Authenticated", true); // allow other logged-in users
// obj.setACL(acl);



let currentUser = null; // global

// CORRECT WAY TO CONNECT USING THE SESSION TOKEN
(async () => {
  const token = sessionStorage.getItem("sessionToken");
  if (!token) {
    console.warn("No token found — redirecting to login.");
    window.location.href = "../User_login_signup/login.html";
    return;
  }

  try {
    currentUser = await Parse.User.become(token); // store globally
    console.log("✅ Authenticated as:", currentUser.getUsername());
  } catch (err) {
    console.error("❌ Invalid token:", err.message);
    sessionStorage.removeItem("sessionToken");
    window.location.href = "../User_login_signup/login.html";
  }
})();

// --- Search function ---
async function searchByZip() {
  if (!currentUser) {  // use the global variable
    console.warn("User not authenticated yet. Please wait...");
    return;
  }

  const zip = document.getElementById("zipcode").value.trim();
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  if (!zip) {
    resultsDiv.innerHTML = "<p>Please enter a ZIP code.</p>";
    return;
  }

  try {
    // Query PetParent
    const Parent = Parse.Object.extend("PetParent");
    const parentQuery = new Parse.Query(Parent);
    parentQuery.equalTo("zip", zip);
    parentQuery.include("user"); //user pointer

    // Query Caretaker
    const Caretaker = Parse.Object.extend("Caretaker");
    const caretakerQuery = new Parse.Query(Caretaker);
    caretakerQuery.equalTo("zip", zip);
    caretakerQuery.include("user"); //points to the user

    // Run both queries
    const [parents, caretakers] = await Promise.all([
      parentQuery.find(),
      caretakerQuery.find()
    ]);

    // Combine and display
    const allResults = [...parents, ...caretakers];
    if (allResults.length === 0) {
      resultsDiv.innerHTML = "<p>No users found for that ZIP code.</p>";
      return;
    }

    allResults.forEach(obj => {
      const userObj = obj.get("user");
      const type = obj.className;
      const username = userObj ? userObj.get("username") : "Unknown";
      const email = userObj ? userObj.get("email") : "No email";

      const card = document.createElement("div");
      card.classList.add("user-card");
      card.innerHTML = `<strong>${username}</strong><br>${email}<br>Type: ${type}<br>ZIP: ${zip}`;
      resultsDiv.appendChild(card);
    });

  } catch (error) {
    console.error("Error searching users:", error);
    resultsDiv.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
  }
}


