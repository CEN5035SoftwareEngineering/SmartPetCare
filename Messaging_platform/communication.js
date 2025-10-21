document.addEventListener("DOMContentLoaded", () => {
  const contacts = document.querySelectorAll(".contact");
  const chatName = document.getElementById("chatName");
  const chatPhoto = document.getElementById("chatPhoto");
  const chatMessages = document.getElementById("chatMessages");
  const sendBtn = document.getElementById("sendBtn");
  const messageInput = document.getElementById("messageInput");

  // Sample message data for demo
  const chats = {
    alex: [
      { sender: "them", text: "Hi! What time should I pick up Bella?", time: "7:58 AM" },
      { sender: "me", text: "8 AM works great!", time: "7:59 AM" }
    ],
    maria: [
      { sender: "them", text: "Hi! How’s Bella doing?", time: "9:10 AM" },
      { sender: "me", text: "She’s doing great, thank you!", time: "9:12 AM" }
    ],
    sarah: [
      { sender: "them", text: "Got it, thank you!", time: "8:45 AM" }
    ]
  };

  // Load selected chat
  contacts.forEach(contact => {
    contact.addEventListener("click", () => {
      contacts.forEach(c => c.classList.remove("active"));
      contact.classList.add("active");

      const chatId = contact.getAttribute("data-chat");
      loadChat(chatId);

      chatName.textContent = contact.querySelector("strong").textContent;
      chatPhoto.src = contact.querySelector("img").src;
    });
  });

  // Load chat messages
  function loadChat(chatId) {
    chatMessages.innerHTML = "";
    (chats[chatId] || []).forEach(msg => {
      const msgDiv = document.createElement("div");
      msgDiv.classList.add("message", msg.sender === "me" ? "sent" : "received");
      msgDiv.innerHTML = `<p>${msg.text}</p><span>${msg.time}</span>`;
      chatMessages.appendChild(msgDiv);
    });
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Default to first chat
  loadChat("alex");

  // Send message
  sendBtn.addEventListener("click", () => {
    const text = messageInput.value.trim();
    if (!text) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", "sent");
    msgDiv.innerHTML = `<p>${text}</p><span>${time}</span>`;
    chatMessages.appendChild(msgDiv);

    messageInput.value = "";
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });
});
