// feedback.js
document.getElementById("feedbackForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();
  const successMsg = document.getElementById("successMsg");

  if (!name || !email || !message) {
    alert("Please fill out all fields.");
    return;
  }

  // Save feedback locally (for demo)
  const feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
  feedbacks.push({ name, email, message, timestamp: new Date().toISOString() });
  localStorage.setItem("feedbacks", JSON.stringify(feedbacks));

  // Reset form and show thank you
  document.getElementById("feedbackForm").reset();
  successMsg.style.display = "block";
});
