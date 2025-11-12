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

// 🔍 Search users (Caretakers or PetParents)
async function searchUsers() {
  const searchInput = document.getElementById("searchInput").value.trim();
  const searchResults = document.getElementById("searchResults");
  searchResults.innerHTML = "";

  if (!searchInput) return;

  try {
    // Query Caretaker class
    const caretakerQuery = new Parse.Query("Caretaker");
    caretakerQuery.matches("name", searchInput, "i");

    // Query PetParent class
    const parentQuery = new Parse.Query("PetParent");
    parentQuery.matches("name", searchInput, "i");

    // Run both separately
    const [caretakers, parents] = await Promise.all([
      caretakerQuery.find(),
      parentQuery.find()
    ]);

    // Combine results
    const results = [...caretakers, ...parents];

    if (results.length === 0) {
      searchResults.innerHTML = "<li>No users found.</li>";
      return;
    }

    // Display results
    results.forEach(obj => {
      const userPointer = obj.get("user");
      if (!userPointer) return;

      const li = document.createElement("li");
      li.textContent = obj.get("name") || "(Unnamed)";
      li.dataset.userid = userPointer.id;
      li.addEventListener("click", () => openChat(userPointer.id, obj.get("name")));
      searchResults.appendChild(li);
    });
  } catch (err) {
    console.error("Search error:", err);
    searchResults.innerHTML = `<li>Error searching users: ${err.message}</li>`;
  }
}


// 💬 Send message
async function sendMessage(receiverId, text) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    alert("No logged-in user found.");
    return;
  }

  // --- Try to resolve receiver from any class ---
  let receiver = null;

  // 1️⃣ Try _User first
  const userQuery = new Parse.Query(Parse.User);
  try {
    receiver = await userQuery.get(receiverId);
  } catch (e) {
    console.warn("Receiver not found in _User, trying profile classes...");
  }

  // 2️⃣ Try Caretaker if not found
  if (!receiver) {
    const caretakerQuery = new Parse.Query("Caretaker");
    caretakerQuery.equalTo("userId", receiverId);
    const caretaker = await caretakerQuery.first();
    if (caretaker) {
      receiver = caretaker.get("userPointer");
    }
  }

  // 3️⃣ Try PetParent if still not found
  if (!receiver) {
    const parentQuery = new Parse.Query("PetParent");
    parentQuery.equalTo("userId", receiverId);
    const parent = await parentQuery.first();
    if (parent) {
      receiver = parent.get("userPointer");
    }
  }

  // 🚨 Final check
  if (!receiver) {
    alert("Error: Could not find receiver user account.");
    return;
  }

  // --- Create and save message ---
  const Message = Parse.Object.extend("Messages");
  const message = new Message();
  message.set("sender", currentUser);
  message.set("receiver", receiver);
  message.set("text", text);
  message.set("read", false);

  try {
    await message.save();
    console.log("✅ Message sent!");
    await updateContact(currentUser, receiver, message);
  } catch (error) {
    console.error("❌ Error sending message:", error);
    alert("Error sending message: " + error.message);
  }
}


// 👥 Update contact list
async function updateContact(user, contactUser, lastMessage) {
  const Contacts = Parse.Object.extend("Contacts");

  // Check if contact already exists
  const query = new Parse.Query("Contacts");
  query.equalTo("user", user);
  query.equalTo("contact", contactUser);
  const exists = await query.first();

  if (!exists) {
    const newContact = new Contacts();
    newContact.set("user", user);
    newContact.set("contact", contactUser);
    newContact.set("lastMessage", lastMessage);
    await newContact.save();
  } else {
    exists.set("lastMessage", lastMessage);
    await exists.save();
  }
}

// 📥 Load messages between two users
async function loadConversation(otherUserId) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return [];

  const user = new Parse.User();
  user.id = otherUserId;

  const sent = new Parse.Query("Messages");
  sent.equalTo("sender", currentUser);
  sent.equalTo("receiver", user);

  const received = new Parse.Query("Messages");
  received.equalTo("sender", user);
  received.equalTo("receiver", currentUser);

  const mainQuery = Parse.Query.or(sent, received);
  mainQuery.ascending("createdAt");
  mainQuery.include("sender");
  mainQuery.include("receiver");

  const messages = await mainQuery.find();
  const chatBox = document.getElementById("chatBox");
  chatBox.innerHTML = "";

  messages.forEach(msg => {
    const from = msg.get("sender").id === currentUser.id ? "You" : "Them";
    const p = document.createElement("p");
    p.textContent = `${from}: ${msg.get("text")}`;
    chatBox.appendChild(p);
  });

  return messages;
}

// Example button triggers (hook these up to your HTML)
document.getElementById("searchBtn").onclick = () => {
  const term = document.getElementById("searchInput").value;
  searchUsers(term);
};

document.getElementById("sendBtn").onclick = () => {
  const msg = document.getElementById("messageInput").value;
  const receiverId = document.getElementById("receiverId").value; // hidden field set when chat opens
  sendMessage(receiverId, msg);
};




















// document.addEventListener("DOMContentLoaded", async () => {
//   if (typeof Parse === "undefined") {
//     console.error("Parse SDK not loaded!");
//     return;
//   }

//   // Initialize Parse (if not already initialized elsewhere)
//   Parse.initialize("fefJHvdGDQOAtrHXUOVnX62hq3s2KB8gUViNUWWP", "klHYFmiUyu9MhG0kVa4U5zjuyVyMD0oWpo33gHfb");
//   Parse.serverURL = "https://parseapi.back4app.com/";

//   const currentUser = Parse.User.current();
//   console.log(currentUser);
//   if (!currentUser) {
//     alert("Please log in first.");
//     window.location.href = "../User_login_signup/login.html";
//     return;
//   }

//   // DOM elements
//   const backToProfile = document.getElementById("backToProfile");
//   const contactList = document.getElementById("contactList");
//   const searchInput = document.getElementById("searchInput");
//   const searchBtn = document.getElementById("searchBtn");
//   const searchResults = document.getElementById("searchResults");
//   const chatWith = document.getElementById("chatWith");
//   const chatBox = document.getElementById("chatBox");
//   const messageInput = document.getElementById("messageInput");
//   const sendBtn = document.getElementById("sendBtn");

//   let selectedContact = null;
//   let chatPollInterval = null;



//   // Search for users
//   searchBtn.addEventListener("click", async () => {
//     const username = searchInput.value.trim();
//     if (!username) return;

//     const query = new Parse.Query(Parse.User);
//     query.matches("username", username, "i");
//     query.notEqualTo("objectId", currentUser.id);
//     try {
//       const results = await query.find();
//       searchResults.innerHTML = "";
//       if (results.length === 0) {
//         searchResults.innerHTML = "<li>No users found.</li>";
//         return;
//       }

//       results.forEach((user) => {
//         const li = document.createElement("li");
//         li.textContent = user.get("username");
//         const addBtn = document.createElement("button");
//         addBtn.textContent = "Add Contact";
//         addBtn.classList.add("small-btn");
//         addBtn.style.marginLeft = "10px";
//         addBtn.addEventListener("click", () => addContact(user));
//         li.appendChild(addBtn);
//         searchResults.appendChild(li);
//       });
//     } catch (err) {
//       console.error("Search error:", err);
//     }
//   });

//   // Add contact
//   async function addContact(user) {
//     const Contacts = Parse.Object.extend("Contacts");
//     const query = new Parse.Query(Contacts);
//     query.equalTo("sender", currentUser);
//     query.equalTo("receiver", user);

//     const existing = await query.first();
//     if (existing) {
//       alert("This user is already in your contacts.");
//       return;
//     }

//     const contact = new Contacts();
//     contact.set("sender", currentUser);
//     contact.set("receiver", user);

//     try {
//       await contact.save();
//       alert("Contact added!");
//       loadContacts();
//     } catch (err) {
//       alert("Error adding contact: " + err.message);
//     }
//   }

//   // Load all contacts (both sent and received)
//   async function loadContacts() {
//     const Contacts = Parse.Object.extend("Contacts");
//     const sentQuery = new Parse.Query(Contacts);
//     sentQuery.equalTo("sender", currentUser);
//     const receivedQuery = new Parse.Query(Contacts);
//     receivedQuery.equalTo("receiver", currentUser);

//     const allContacts = await Parse.Query.or(sentQuery, receivedQuery).find();
//     contactList.innerHTML = "";

//     if (allContacts.length === 0) {
//       contactList.innerHTML = "<li>No contacts yet.</li>";
//       return;
//     }

//     for (const c of allContacts) {
//       const otherUser =
//         c.get("sender").id === currentUser.id
//           ? c.get("receiver")
//           : c.get("sender");

//       await otherUser.fetch();

//       const li = document.createElement("li");
//       li.textContent = otherUser.get("username");
//       li.classList.add("contact-item");
//       li.style.cursor = "pointer";
//       li.addEventListener("click", () => openChat(otherUser));
//       contactList.appendChild(li);
//     }
//   }

//   // Open chat with contact
//   async function openChat(contactUser) {
//     selectedContact = contactUser;
//     chatWith.textContent = `Chat with ${contactUser.get("username")}`;
//     chatBox.innerHTML = "";
//     if (chatPollInterval) clearInterval(chatPollInterval);

//     await loadMessages();
//     chatPollInterval = setInterval(loadMessages, 3000);
//   }

//   // Load chat messages
//   async function loadMessages() {
//     if (!selectedContact) return;
//     const Messages = Parse.Object.extend("Messages");

//     const sentQuery = new Parse.Query(Messages);
//     sentQuery.equalTo("sender", currentUser);
//     sentQuery.equalTo("receiver", selectedContact);

//     const receivedQuery = new Parse.Query(Messages);
//     receivedQuery.equalTo("sender", selectedContact);
//     receivedQuery.equalTo("receiver", currentUser);

//     const allMessages = await Parse.Query.or(sentQuery, receivedQuery)
//       .ascending("createdAt")
//       .find();

//     chatBox.innerHTML = "";

//     allMessages.forEach((msg) => {
//       const div = document.createElement("div");
//       div.textContent = msg.get("content");
//       div.style.margin = "5px 0";
//       div.style.padding = "5px 10px";
//       div.style.borderRadius = "10px";
//       div.style.maxWidth = "70%";

//       if (msg.get("sender").id === currentUser.id) {
//         div.style.alignSelf = "flex-end";
//         div.style.background = "#DCF8C6";
//       } else {
//         div.style.background = "#eee";
//       }

//       chatBox.appendChild(div);
//     });

//     chatBox.scrollTop = chatBox.scrollHeight;
//   }

//   // Send message
//   sendBtn.addEventListener("click", async () => {
//     const text = messageInput.value.trim();
//     if (!text || !selectedContact) return;

//     const Messages = Parse.Object.extend("Messages");
//     const msg = new Messages();
//     msg.set("sender", currentUser);
//     msg.set("receiver", selectedContact);
//     msg.set("content", text);

//     try {
//       await msg.save();
//       messageInput.value = "";
//       await loadMessages();
//     } catch (err) {
//       alert("Error sending message: " + err.message);
//     }
//   });

//   // Load contacts on start
//   loadContacts();
// });




// // Initialize Parse
// Parse.initialize("fefJHvdGDQOAtrHXUOVnX62hq3s2KB8gUViNUWWP", "klHYFmiUyu9MhG0kVa4U5zjuyVyMD0oWpo33gHfb");
// Parse.serverURL = "https://parseapi.back4app.com/";

// document.addEventListener("DOMContentLoaded", async () => {
// // --- DOM Elements ---
// const searchInput = document.getElementById("userSearchInput");
// const searchBtn = document.getElementById("searchUserBtn");
// const searchResults = document.getElementById("searchResults");
// const contactsList = document.getElementById("contactList");
// const chatName = document.getElementById("chatName");
// const chatPhoto = document.getElementById("chatPhoto");
// const chatMessages = document.getElementById("chatMessages");
// const messageInput = document.getElementById("messageInput");
// const sendBtn = document.getElementById("sendBtn");

// // --- Current user ---
// const currentUser = Parse.User.current();
// if (!currentUser) {
// alert("You must be logged in to view messages.");
// window.location.href = "../Login/login.html";
// return;
// }

// let selectedUser = null;

// // ----------------------------
// // Search existing users
// // ----------------------------
// searchBtn.addEventListener("click", async () => {
// const term = searchInput.value.trim();
// if (!term) return;

// const query = new Parse.Query(Parse.User);
// query.notEqualTo("objectId", currentUser.id);
// query.matches("username", term, "i"); // case-insensitive

// try {
// const users = await query.find();
// searchResults.innerHTML = "";

// if (users.length === 0) {
// searchResults.innerHTML = "<li>No users found.</li>";
// return;
// }

// users.forEach(user => {
// const li = document.createElement("li");
// li.textContent = user.get("username");
// li.addEventListener("click", () => openChat(user));
// searchResults.appendChild(li);
// });

// } catch (err) {
// console.error("Search error:", err);
// searchResults.innerHTML = `<li style="color:red;">${err.message}</li>`;
// }
// });

// // ----------------------------
// // Load contacts (all users except self)
// // ----------------------------
// async function loadContacts() {
// const query = new Parse.Query(Parse.User);
// query.notEqualTo("objectId", currentUser.id);
// const users = await query.find();

// contactsList.innerHTML = "";
// users.forEach(user => {
// const li = document.createElement("li");
// li.classList.add("contact");
// li.dataset.id = user.id;
// li.innerHTML = `<strong>${user.get("username")}</strong>`;
// li.addEventListener("click", () => openChat(user));
// contactsList.appendChild(li);
// });
// }

// // ----------------------------
// // Open chat with user
// // ----------------------------
// async function openChat(user) {
// selectedUser = user;
// chatName.textContent = user.get("username");
// chatPhoto.src = "img/placeholder.png"; // can replace with user photo if available
// chatMessages.innerHTML = "";
// await loadMessages();
// }

// // ----------------------------
// // Load messages between currentUser and selectedUser
// // ----------------------------
// async function loadMessages() {
// if (!selectedUser) return;

// const Message = Parse.Object.extend("Message");

// const sentQuery = new Parse.Query(Message);
// sentQuery.equalTo("sender", currentUser);
// sentQuery.equalTo("receiver", selectedUser);

// const receivedQuery = new Parse.Query(Message);
// receivedQuery.equalTo("sender", selectedUser);
// receivedQuery.equalTo("receiver", currentUser);

// const mainQuery = Parse.Query.or(sentQuery, receivedQuery);
// mainQuery.ascending("createdAt");
// mainQuery.include("sender");
// mainQuery.include("receiver");

// const messages = await mainQuery.find();

// chatMessages.innerHTML = "";
// messages.forEach(msg => {
// const senderId = msg.get("sender").id;
// const msgDiv = document.createElement("div");
// msgDiv.classList.add("message", senderId === currentUser.id ? "sent" : "received");
// msgDiv.innerHTML = `
// <p>${msg.get("text")}</p>
// <span>${new Date(msg.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
// `;
// chatMessages.appendChild(msgDiv);
// });

// chatMessages.scrollTop = chatMessages.scrollHeight;
// }

// // ----------------------------
// // Send message
// // ----------------------------
// sendBtn.addEventListener("click", async () => {
// const text = messageInput.value.trim();
// if (!text || !selectedUser) return;

// const Message = Parse.Object.extend("Message");
// const message = new Message();
// message.set("text", text);
// message.set("sender", currentUser); // pointer to logged-in user
// message.set("receiver", selectedUser); // pointer to existing user

// try {
// await message.save();
// messageInput.value = "";
// await loadMessages();
// } catch (err) {
// console.error("Send message error:", err);
// }
// });

// // ----------------------------
// // Initial load of contacts
// // ----------------------------
// await loadContacts();
// });
