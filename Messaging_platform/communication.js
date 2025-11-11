document.addEventListener("DOMContentLoaded", async () => {
  const contactsList = document.getElementById("contactList");
  const chatName = document.getElementById("chatName");
  const chatPhoto = document.getElementById("chatPhoto");
  const chatMessages = document.getElementById("chatMessages");
  const sendBtn = document.getElementById("sendBtn");
  const messageInput = document.getElementById("messageInput");

  // --- SETUP ---
  const currentUser = Parse.User.current();
  if (!currentUser) {
    alert("You must be logged in to view messages.");
    window.location.href = "../Login/login.html";
    return;
  }

  let selectedUserId = null;

  // --- LOAD CONTACTS ---
  async function loadContacts() {
    // Example: Query all other users
    const query = new Parse.Query(Parse.User);
    query.notEqualTo("objectId", currentUser.id);
    const users = await query.find();

    contactsList.innerHTML = "";
    users.forEach(user => {
      const li = document.createElement("li");
      li.classList.add("contact");
      li.dataset.id = user.id;
      li.innerHTML = `
        <img src="https://via.placeholder.com/50" alt="${user.get('username')}">
        <div>
          <strong>${user.get('username')}</strong>
          <p>Tap to open chat</p>
        </div>
      `;
      li.addEventListener("click", () => openChat(user));
      contactsList.appendChild(li);
    });
  }

  // --- OPEN CHAT WITH SELECTED USER ---
  async function openChat(user) {
    selectedUserId = user.id;
    chatName.textContent = user.get("username");
    chatPhoto.src = "https://via.placeholder.com/50";
    chatMessages.innerHTML = "";

    await loadMessages();
  }

  // --- LOAD MESSAGES ---
  async function loadMessages() {
    if (!selectedUserId) return;

    const Message = Parse.Object.extend("Message");
    const query1 = new Parse.Query(Message);
    query1.equalTo("sender", currentUser);
    query1.equalTo("receiverId", selectedUserId);

    const query2 = new Parse.Query(Message);
    query2.equalTo("receiver", currentUser);
    query2.equalTo("senderId", selectedUserId);

    const mainQuery = Parse.Query.or(query1, query2);
    mainQuery.ascending("createdAt");

    const messages = await mainQuery.find();

    chatMessages.innerHTML = "";
    messages.forEach(msg => {
      const text = msg.get("text");
      const sender = msg.get("senderId") === currentUser.id ? "me" : "them";
      const msgDiv = document.createElement("div");
      msgDiv.classList.add("message", sender === "me" ? "sent" : "received");
      msgDiv.innerHTML = `<p>${text}</p><span>${new Date(msg.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>`;
      chatMessages.appendChild(msgDiv);
    });

    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // --- SEND MESSAGE ---
  sendBtn.addEventListener("click", async () => {
    const text = messageInput.value.trim();
    if (!text || !selectedUserId) return;

    const Message = Parse.Object.extend("Message");
    const message = new Message();
    message.set("text", text);
    message.set("sender", currentUser);
    message.set("receiverId", selectedUserId);
    message.set("senderId", currentUser.id);

    try {
      await message.save();
      messageInput.value = "";
      await loadMessages();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  // Load contact list
  await loadContacts();
});
