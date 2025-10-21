// post.js
document.getElementById("postForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const fileInput = document.getElementById("dogPhoto");
  const file = fileInput.files[0];
  const successMsg = document.getElementById("successMsg");

  if (!username || !file) return alert("Please fill out all fields.");

  const reader = new FileReader();
  reader.onload = function(event) {
    const postData = {
      username,
      image: event.target.result, // base64 image
      timestamp: new Date().toISOString(),
    };

    // Get existing posts
    const posts = JSON.parse(localStorage.getItem("dogPosts")) || [];
    posts.push(postData);
    localStorage.setItem("dogPosts", JSON.stringify(posts));

    successMsg.style.display = "block";
    document.getElementById("postForm").reset();
  };

  reader.readAsDataURL(file);
});
