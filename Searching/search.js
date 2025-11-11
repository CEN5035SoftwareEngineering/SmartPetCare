// Initialize Parse at the top
Parse.initialize("fefJHvdGDQOAtrHXUOVnX62hq3s2KB8gUViNUWWP", 
                 "klHYFmiUyu9MhG0kVa4U5zjuyVyMD0oWpo33gHfb");
Parse.serverURL = "https://parseapi.back4app.com/";

document.addEventListener("DOMContentLoaded", async () => {
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const searchResults = document.getElementById("searchResults");

  // --- Check if user is logged in ---
  const currentUser = Parse.User.current();
  // if (!currentUser) {
  //   alert("You must be logged in to view this page.");
  //   window.location.href = "../User_login_signup/login.html";
  //   return;
  // }

  // --- Function to search users by username ---
  async function searchUsers(term) {
    searchResults.innerHTML = "<li>Searching...</li>";

    try {
      const query = new Parse.Query(Parse.User);
      console.log(query);
      query.notEqualTo("objectId", currentUser.id); // exclude yourself
      query.matches("username", term, "i");         // case-insensitive

      const users = await query.find();
      if (users.length === 0) {
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

  // --- Add user to Contacts ---
  async function addToContacts(user) {
    const Contacts = Parse.Object.extend("Contacts");

    // Check if already added
    const query = new Parse.Query(Contacts);
    query.equalTo("owner", currentUser);
    query.equalTo("contact", user);
    const exists = await query.first();

    if (exists) {
      alert(`${user.get("username")} is already in your contacts.`);
      return;
    }

    const contact = new Contacts();
    contact.set("owner", currentUser);
    contact.set("contact", user);

    try {
      await contact.save();
      alert(`${user.get("username")} added to contacts!`);
    } catch (err) {
      console.error("Error adding contact:", err);
      alert("Failed to add contact: " + err.message);
    }
  }

  // --- Event listeners ---
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
