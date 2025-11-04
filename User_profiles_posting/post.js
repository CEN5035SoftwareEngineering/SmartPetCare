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

// // post.js
// document.getElementById("postForm").addEventListener("submit", function(e) {
//   e.preventDefault();

//   const username = document.getElementById("username").value.trim();
//   const fileInput = document.getElementById("dogPhoto");
//   const file = fileInput.files[0];
//   const successMsg = document.getElementById("successMsg");

//   if (!username || !file) return alert("Please fill out all fields.");

//   const reader = new FileReader();
//   reader.onload = function(event) {
//     const postData = {
//       username,
//       image: event.target.result, // base64 image
//       timestamp: new Date().toISOString(),
//     };

//     // Get existing posts
//     const posts = JSON.parse(localStorage.getItem("dogPosts")) || [];
//     posts.push(postData);
//     localStorage.setItem("dogPosts", JSON.stringify(posts));

//     successMsg.style.display = "block";
//     document.getElementById("postForm").reset();
//   };

//   reader.readAsDataURL(file);
// });
