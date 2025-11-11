// Initialize Parse
Parse.initialize("fefJHvdGDQOAtrHXUOVnX62hq3s2KB8gUViNUWWP", "klHYFmiUyu9MhG0kVa4U5zjuyVyMD0oWpo33gHfb");
Parse.serverURL = "https://parseapi.back4app.com/";

document.addEventListener("DOMContentLoaded", async () => {
// --- DOM Elements ---
const searchInput = document.getElementById("userSearchInput");
const searchBtn = document.getElementById("searchUserBtn");
const searchResults = document.getElementById("searchResults");
const contactsList = document.getElementById("contactList");
const chatName = document.getElementById("chatName");
const chatPhoto = document.getElementById("chatPhoto");
const chatMessages = document.getElementById("chatMessages");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

// --- Current user ---
const currentUser = Parse.User.current();
if (!currentUser) {
alert("You must be logged in to view messages.");
window.location.href = "../Login/login.html";
return;
}

let selectedUser = null;

// ----------------------------
// Search existing users
// ----------------------------
searchBtn.addEventListener("click", async () => {
const term = searchInput.value.trim();
if (!term) return;

const query = new Parse.Query(Parse.User);
query.notEqualTo("objectId", currentUser.id);
query.matches("username", term, "i"); // case-insensitive

try {
const users = await query.find();
searchResults.innerHTML = "";

if (users.length === 0) {
searchResults.innerHTML = "<li>No users found.</li>";
return;
}

users.forEach(user => {
const li = document.createElement("li");
li.textContent = user.get("username");
li.addEventListener("click", () => openChat(user));
searchResults.appendChild(li);
});

} catch (err) {
console.error("Search error:", err);
searchResults.innerHTML = `<li style="color:red;">${err.message}</li>`;
}
});

// ----------------------------
// Load contacts (all users except self)
// ----------------------------
async function loadContacts() {
const query = new Parse.Query(Parse.User);
query.notEqualTo("objectId", currentUser.id);
const users = await query.find();

contactsList.innerHTML = "";
users.forEach(user => {
const li = document.createElement("li");
li.classList.add("contact");
li.dataset.id = user.id;
li.innerHTML = `<strong>${user.get("username")}</strong>`;
li.addEventListener("click", () => openChat(user));
contactsList.appendChild(li);
});
}

// ----------------------------
// Open chat with user
// ----------------------------
async function openChat(user) {
selectedUser = user;
chatName.textContent = user.get("username");
chatPhoto.src = "img/placeholder.png"; // can replace with user photo if available
chatMessages.innerHTML = "";
await loadMessages();
}

// ----------------------------
// Load messages between currentUser and selectedUser
// ----------------------------
async function loadMessages() {
if (!selectedUser) return;

const Message = Parse.Object.extend("Message");

const sentQuery = new Parse.Query(Message);
sentQuery.equalTo("sender", currentUser);
sentQuery.equalTo("receiver", selectedUser);

const receivedQuery = new Parse.Query(Message);
receivedQuery.equalTo("sender", selectedUser);
receivedQuery.equalTo("receiver", currentUser);

const mainQuery = Parse.Query.or(sentQuery, receivedQuery);
mainQuery.ascending("createdAt");
mainQuery.include("sender");
mainQuery.include("receiver");

const messages = await mainQuery.find();

chatMessages.innerHTML = "";
messages.forEach(msg => {
const senderId = msg.get("sender").id;
const msgDiv = document.createElement("div");
msgDiv.classList.add("message", senderId === currentUser.id ? "sent" : "received");
msgDiv.innerHTML = `
<p>${msg.get("text")}</p>
<span>${new Date(msg.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
`;
chatMessages.appendChild(msgDiv);
});

chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ----------------------------
// Send message
// ----------------------------
sendBtn.addEventListener("click", async () => {
const text = messageInput.value.trim();
if (!text || !selectedUser) return;

const Message = Parse.Object.extend("Message");
const message = new Message();
message.set("text", text);
message.set("sender", currentUser); // pointer to logged-in user
message.set("receiver", selectedUser); // pointer to existing user

try {
await message.save();
messageInput.value = "";
await loadMessages();
} catch (err) {
console.error("Send message error:", err);
}
});

// ----------------------------
// Initial load of contacts
// ----------------------------
await loadContacts();
});
