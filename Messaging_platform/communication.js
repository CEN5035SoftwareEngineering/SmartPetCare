// Initialize Parse
Parse.initialize("fefJHvdGDQOAtrHXUOVnX62hq3s2KB8gUViNUWWP", "klHYFmiUyu9MhG0kVa4U5zjuyVyMD0oWpo33gHfb");
Parse.serverURL = "https://parseapi.back4app.com/";
(async () => {
  const token = sessionStorage.getItem("sessionToken");
  if (!token) {
    console.warn("No token found — redirecting to login.");
    window.location.href = "../User_login_signup/login.html";
    return;
  }

  try {
    const user = await Parse.User.become(token);
    console.log("✅ Authenticated as:", user.getUsername());
  } catch (err) {
    console.error("❌ Invalid token:", err.message);
    sessionStorage.removeItem("sessionToken");
    window.location.href = "../User_login_signup/login.html";
  }
})();
async function getCurrentUser() {
  const user = Parse.User.current();
  if (!user) {
    alert("You must be logged in!");
    window.location.href = "../login/login.html";
    return null;
  }
  return user;
}

async function searchUsers() {
  const searchInput = document.getElementById("searchInput").value.trim();
  const searchResults = document.getElementById("searchResults");
  searchResults.innerHTML = "";

  if (!searchInput) return;

  try {
    // Call Cloud Code to search all users
    const results = await Parse.Cloud.run("searchAllUsers", { name: searchInput });

    if (!results || results.length === 0) {
      searchResults.innerHTML = "<li>No users found.</li>";
      return;
    }

    results.forEach(user => {
      const li = document.createElement("li");
      li.classList.add("user-item");

      // Text (username)
      const span = document.createElement("span");
      span.textContent = `${user.name || user.username || "Unnamed"} (${user.type})`;
      span.dataset.userid = user.userId || user.id;
      span.addEventListener("click", () =>
        openChat(user.userId || user.id, user.name || user.username)
      );

      // ➕ Add Contact button
      const addBtn = document.createElement("button");
      addBtn.textContent = "➕ Add";
      addBtn.classList.add("add-contact-btn");
      addBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // prevent triggering openChat()
        addToContacts(user.userId || user.id, user.name || user.username);
      });

      // Combine into <li>
      li.appendChild(span);
      li.appendChild(addBtn);
      searchResults.appendChild(li);
    });
  } catch (err) {
    console.error("Search error:", err);
    searchResults.innerHTML = `<li>Error: ${err.message}</li>`;
  }
}
async function addToContacts(contactUserId, contactName) {
  const currentUser = Parse.User.current();
  if (!currentUser) {
    alert("Please log in first.");
    return;
  }

  try {
    const contactUser = new Parse.User();
    contactUser.id = contactUserId;

    // Prevent duplicates
    const contactQuery = new Parse.Query("Contacts");
    contactQuery.equalTo("owner", currentUser);
    contactQuery.equalTo("contact", contactUser);
    const existing = await contactQuery.first();

    if (existing) {
      alert(`${contactName} is already in your contacts.`);
      return;
    }

    const Contacts = Parse.Object.extend("Contacts");
    const newContact = new Contacts();
    newContact.set("owner", currentUser);
    newContact.set("contact", contactUser);
    await newContact.save();

    alert(`${contactName} added to your contacts.`);
  } catch (err) {
    console.error("Error adding contact:", err);
    alert("Error adding contact: " + err.message);
  }
}
async function listContacts() {
  const currentUser = await getCurrentUser();
  if (!currentUser) return;

  const contactList = document.getElementById("contactList");
  contactList.innerHTML = "<li>Loading contacts...</li>";

  try {
    // Call Cloud Code instead of querying directly
    const results = await Parse.Cloud.run("listContacts");

    contactList.innerHTML = "";

    if (!results || results.length === 0) {
      contactList.innerHTML = "<li>No contacts yet.</li>";
      return;
    }

    results.forEach((c) => {
      const li = document.createElement("li");
      li.classList.add("contact-item");
      li.textContent = c.username;

      li.addEventListener("click", () => {
        openChat(c.id, c.username);
      });

      contactList.appendChild(li);
    });
  } catch (err) {
    console.error("Error loading contacts:", err);
    contactList.innerHTML = `<li>Error loading contacts: ${err.message}</li>`;
  }
}
// Load when page opens
listContacts();

//Open chat with selected user
async function openChat(userId, username) {
  const chatHeader = document.getElementById("chatHeader");
  const chatBox = document.getElementById("chatBox");
  const receiverField = document.getElementById("receiverId");

  // Update chat UI
  if (chatHeader) chatHeader.textContent = `Chat with ${username}`;
  if (receiverField) receiverField.value = userId;
  if (chatBox) chatBox.innerHTML = "<p>Loading messages...</p>";

  try {
    await loadConversation(userId);
  } catch (err) {
    console.error("Error loading conversation:", err);
    if (chatBox)
      chatBox.innerHTML = `<p style="color:red;">${err.message}</p>`;
  }

  if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
}

let currentReceiverId = null;

// 📥 Load messages between the logged-in user and the selected contact
// async function loadConversation(otherUserId) {
//   const currentUser = await getCurrentUser();
//   if (!currentUser) return [];
//   currentReceiverId = otherUserId;

//   try {
//     // Call Cloud Code to fetch conversation messages
//     const messages = await Parse.Cloud.run("loadConversation", {
//       otherUserId: otherUserId,
//     });

//     const chatBox = document.getElementById("chatBox");
//     chatBox.innerHTML = "";

//     if (messages.length === 0) {
//       chatBox.innerHTML = "<p>No messages yet. Say hi!</p>";
//       return;
//     }

//     // Render messages
//     messages.forEach((msg) => {
//       const from =
//         msg.senderId === currentUser.id ? "You" : msg.senderUsername;
//       const p = document.createElement("p");
//       p.innerHTML = `<strong>${from}:</strong> ${msg.text}`;
//       chatBox.appendChild(p);
//     });

//     // Scroll to bottom
//     chatBox.scrollTop = chatBox.scrollHeight;
//   } catch (err) {
//     console.error("Error loading conversation:", err);
//     document.getElementById("chatBox").innerHTML =
//       `<p style="color:red;">${err.message}</p>`;
//   }
// }
// 📥 Load messages between the logged-in user and the selected contact
async function loadConversation(otherUserId) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return [];

  currentReceiverId = otherUserId;

  try {
    // Call Cloud Code to fetch conversation messages
    const messages = await Parse.Cloud.run("loadConversation", {
      otherUserId: otherUserId,
    });

    const chatBox = document.getElementById("chatBox");
    chatBox.innerHTML = "";

    if (!messages || messages.length === 0) {
      chatBox.innerHTML = "<p>No messages yet. Say hi!</p>";
      return;
    }

    // Render messages
    messages.forEach((msg) => {
      const from =
        msg.senderId === currentUser.id
          ? "You"
          : msg.senderUsername || "Unknown User";

      const p = document.createElement("p");
      p.innerHTML = `<strong>${from}:</strong> ${msg.text}`;
      chatBox.appendChild(p);
    });

    // Scroll to bottom
    chatBox.scrollTop = chatBox.scrollHeight;
  } catch (err) {
    console.error("Error loading conversation:", err);
    document.getElementById("chatBox").innerHTML =
      `<p style="color:red;">${err.message}</p>`;
  }
}



// 💬 Send message using Cloud Code
async function sendMessage(receiverId, text) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    alert("You must be logged in to send messages.");
    return;
  }

  if (!receiverId || !text.trim()) {
    alert("Please select a user and enter a message.");
    return;
  }

  try {
    // Call the Cloud Function
    const result = await Parse.Cloud.run("sendMessage", { receiverId, text });

    console.log("✅ Message sent successfully!", result);
    document.getElementById("messageInput").value = "";

    // Reload conversation immediately
    await loadConversation(receiverId);
  } catch (error) {
    console.error("❌ Error sending message:", error);
    alert("Error sending message: " + error.message);
  }
}


// // 🔄 Ensure both users appear in each other's contact lists
// async function updateContacts(currentUser, receiver) {
//   const Contacts = Parse.Object.extend("Contacts");

//   // Check if this contact pair already exists
//   const query = new Parse.Query(Contacts);
//   query.equalTo("user", currentUser);
//   query.equalTo("contact", receiver);
//   const existing = await query.first();

//   // If not, create it
//   if (!existing) {
//     const contact = new Contacts();
//     contact.set("user", currentUser);
//     contact.set("contact", receiver);
//     await contact.save();
//     console.log(`🤝 Added ${receiver.get("username")} to contacts`);
//     await listContacts(); // refresh sidebar
//   }
// }

//sending button to send the message
document.getElementById("sendBtn").addEventListener("click", async () => {
  const text = document.getElementById("messageInput").value;
  const receiverId = currentReceiverId; // this should be set in loadConversation()
  await sendMessage(receiverId, text);
});


// // 🔘 Hook up buttons to UI
// document.getElementById("searchBtn").onclick = async () => {
//   await searchUsers();
// };



















