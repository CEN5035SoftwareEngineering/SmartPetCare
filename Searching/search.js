// search.js

document.addEventListener("DOMContentLoaded", async () => {
  if (typeof Parse === "undefined") {
    console.error("Parse SDK not loaded!");
    return;
  }

  const currentUser = Parse.User.current();
  const urlParams = new URLSearchParams(window.location.search);
  const publicId = urlParams.get("id");
  const isPublicView = !!publicId;

  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const searchResults = document.getElementById("searchResults");

  // --- Search Users Function ---
  async function searchUsers(term) {
    searchResults.innerHTML = "<li>Searching...</li>";

    try {
      const query = new Parse.Query(Parse.User);
      query.notEqualTo("objectId", currentUser.id); // exclude self
      query.matches("username", term, "i"); // case-insensitive

      const users = await query.find({ sessionToken: currentUser.getSessionToken() });

      if (!users.length) {
        searchResults.innerHTML = "<li>No users found.</li>";
        return;
      }

      searchResults.innerHTML = "";
      users.forEach(user => {
        const li = document.createElement("li");
        li.textContent = user.get("username");
        li.addEventListener("click", async () => {
          await addToContacts(user);
        });
        searchResults.appendChild(li);
      });

    } catch (err) {
      console.error("Search error:", err);
      searchResults.innerHTML = `<li style="color:red;">${err.message}</li>`;
    }
  }

  // --- Add to Contacts Function ---
  async function addToContacts(user) {
    const Contacts = Parse.Object.extend("Contacts");

    const query = new Parse.Query(Contacts);
    query.equalTo("owner", currentUser);
    query.equalTo("contact", user);

    try {
      const exists = await query.first({ sessionToken: currentUser.getSessionToken() });
      if (exists) {
        alert(`${user.get("username")} is already in your contacts.`);
        return;
      }

      const contact = new Contacts();
      contact.set("owner", currentUser);
      contact.set("contact", user);

      await contact.save(null, { sessionToken: currentUser.getSessionToken() });
      alert(`${user.get("username")} added to contacts!`);

    } catch (err) {
      console.error("Error adding contact:", err);
      alert("Failed to add contact: " + err.message);
    }
  }

  // --- Event Listeners ---
  searchBtn.addEventListener("click", () => {
    const term = searchInput.value.trim();
    if (term) searchUsers(term);
  });

  searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      const term = searchInput.value.trim();
      if (term) searchUsers(term);
    }
  });

});


// Parse.initialize(
//   "fefJHvdGDQOAtrHXUOVnX62hq3s2KB8gUViNUWWP",
//   "klHYFmiUyu9MhG0kVa4U5zjuyVyMD0oWpo33gHfb"
// );
// Parse.serverURL = "https://parseapi.back4app.com/";

// document.addEventListener("DOMContentLoaded", async () => {
//   if (typeof Parse === "undefined") {
//     console.error("Parse SDK not loaded!");
//     return;
//   }

//   // --- Get current user asynchronously ---
//   const currentUser = await Parse.User.currentAsync();
//   console.log(currentUser);

//   // if (!currentUser) {
//   //   alert("You must be logged in to view this page.");
//   //   window.location.href = "../User_login_signup/login.html"; // redirect to login
//   //   return;
//   // }

//   console.log("Current logged-in user:", currentUser.get("username"));

//   const searchInput = document.getElementById("searchInput");
//   const searchBtn = document.getElementById("searchBtn");
//   const searchResults = document.getElementById("searchResults");

//   // --- Search Users Function ---
//   async function searchUsers(term) {
//     searchResults.innerHTML = "<li>Searching...</li>";

//     try {
//       const query = new Parse.Query(Parse.User);
//       query.notEqualTo("objectId", currentUser.id); // exclude self
//       query.matches("username", term, "i"); // case-insensitive

//       const users = await query.find({ sessionToken: currentUser.getSessionToken() });

//       if (!users.length) {
//         searchResults.innerHTML = "<li>No users found.</li>";
//         return;
//       }

//       searchResults.innerHTML = "";
//       users.forEach(user => {
//         const li = document.createElement("li");
//         li.textContent = user.get("username");
//         li.addEventListener("click", async () => {
//           await addToContacts(user);
//         });
//         searchResults.appendChild(li);
//       });

//     } catch (err) {
//       console.error("Search error:", err);
//       searchResults.innerHTML = `<li style="color:red;">${err.message}</li>`;
//     }
//   }

//   // --- Add to Contacts Function ---
//   async function addToContacts(user) {
//     const Contacts = Parse.Object.extend("Contacts");

//     const query = new Parse.Query(Contacts);
//     query.equalTo("owner", currentUser);
//     query.equalTo("contact", user);

//     try {
//       const exists = await query.first({ sessionToken: currentUser.getSessionToken() });
//       if (exists) {
//         alert(`${user.get("username")} is already in your contacts.`);
//         return;
//       }

//       const contact = new Contacts();
//       contact.set("owner", currentUser);
//       contact.set("contact", user);

//       await contact.save(null, { sessionToken: currentUser.getSessionToken() });
//       alert(`${user.get("username")} added to contacts!`);

//     } catch (err) {
//       console.error("Error adding contact:", err);
//       alert("Failed to add contact: " + err.message);
//     }
//   }

//   // --- Event Listeners ---
//   searchBtn.addEventListener("click", () => {
//     const term = searchInput.value.trim();
//     if (term) searchUsers(term);
//   });

//   searchInput.addEventListener("keyup", (e) => {
//     if (e.key === "Enter") {
//       const term = searchInput.value.trim();
//       if (term) searchUsers(term);
//     }
//   });

// });
