// Initialize Back4App
Parse.initialize("fefJHvdGDQOAtrHXUOVnX62hq3s2KB8gUViNUWWP", "klHYFmiUyu9MhG0kVa4U5zjuyVyMD0oWpo33gHfb");
Parse.serverURL = "https://parseapi.back4app.com/";

console.log("Back4App connected for Feedback page");
async function createFeedback() {
  const targetId = document.getElementById("targetId").value.trim();
  const role = document.getElementById("role").value;
  const text = document.getElementById("text").value.trim();
  const rating = Number(document.getElementById("rating").value);
  const output = document.getElementById("createOut");

  if (!targetId || !text || !rating) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    const author = Parse.User.current();
    if (!author) {
      alert("You must be logged in to submit feedback.");
      return;
    }

    const Feedback = Parse.Object.extend("Feedback");
    const feedback = new Feedback();

    feedback.set("author", author);
    feedback.set("target", targetId);
    feedback.set("text", text);
    feedback.set("role", role);
    feedback.set("rating", rating);

    await feedback.save();
    output.textContent = "✅ Feedback submitted successfully!";
    document.getElementById("text").value = "";
    document.getElementById("rating").value = "";

  } catch (err) {
    console.error("❌ Error:", err);
    output.textContent = err.message;
  }
}

async function listFeedback() {
  const feedbackList = document.getElementById("feedbackList");
  feedbackList.innerHTML = "<p>Loading...</p>";

  try {
    const Feedback = Parse.Object.extend("Feedback");
    const query = new Parse.Query(Feedback);
    query.include("author");
    query.descending("createdAt");

    const results = await query.find();

    if (results.length === 0) {
      feedbackList.innerHTML = "<p>No feedback yet.</p>";
      return;
    }

    feedbackList.innerHTML = results.map(fb => {
      const data = fb.toJSON();
      const authorName = data.author?.username || "Anonymous";
      const stars = "⭐".repeat(data.rating);
      return `
        <div class="feedback-item">
          <strong>${authorName}</strong> (${data.role})
          <div><em>for ${data.target}</em></div>
          <div class="rating">${stars} (${data.rating}/5)</div>
          <p>${data.text}</p>
          <small>${new Date(data.createdAt).toLocaleString()}</small>
        </div>
      `;
    }).join("");
  } catch (err) {
    console.error("❌ Error listing feedback:", err);
    feedbackList.innerHTML = `<p style="color:red;">${err.message}</p>`;
  }
}