document.getElementById("postForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const user = document.getElementById("postUser").value.trim();
  const caption = document.getElementById("postCaption").value.trim();
  const photoInput = document.getElementById("postPhoto").files[0];

  if (!photoInput || !caption || !user) {
    alert("Please complete all fields.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    const newPost = {
      user: user,
      caption: caption,
      photo: event.target.result,
      timestamp: new Date().toISOString()
    };

    // Save to localStorage
    const posts = JSON.parse(localStorage.getItem("dogPosts")) || [];
    posts.unshift(newPost);
    localStorage.setItem("dogPosts", JSON.stringify(posts));

    // Redirect to Scroll View
    window.location.href = "scroll_view.html";
  };
  reader.readAsDataURL(photoInput);
});
