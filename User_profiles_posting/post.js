// post.js 
document.addEventListener("DOMContentLoaded", () => {
  Parse.initialize("fefJHvdGDQOAtrHXUOVnX62hq3s2KB8gUViNUWWP", "klHYFmiUyu9MhG0kVa4U5zjuyVyMD0oWpo33gHfb");
  Parse.serverURL = 'https://parseapi.back4app.com/';

  const form = document.getElementById("postForm");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const caption = document.getElementById("postCaption").value.trim();
    const photoInput = document.getElementById("postPhoto").files[0];

    const currentUser = Parse.User.current();
    if (!currentUser) {
      alert("You must be logged in to post.");
      return;
    }

    if (!photoInput || !caption) {
      alert("Please complete all fields.");
      return;
    }

    try {
      const Post = Parse.Object.extend("Post");
      const post = new Post();

      // const photoFile = new Parse.File(photoInput.name, photoInput);
      console.log("📸 Uploading file:", photoInput.name);
      const photoFile = new Parse.File(photoInput.name, photoInput);
      await photoFile.save(); // ensures file uploads before saving post
      // post.set("photo", photoFile);
      console.log("File successfully uploaded:", photoFile.url());


      post.set("user", currentUser);
      post.set("caption", caption);
      post.set("photo", photoFile);
      post.set("timeStamp", new Date());

      // Public read access so others can view it in scroll/profile
      const acl = new Parse.ACL(currentUser);
      acl.setPublicReadAccess(true);
      post.setACL(acl);

      // Add profileType to distinguish PetParent vs Caretaker
      const PetParent = Parse.Object.extend("PetParent");
      const parentQuery = new Parse.Query(PetParent);
      parentQuery.equalTo("user", currentUser);
      const parentProfile = await parentQuery.first();

      post.set("profileType", parentProfile ? "PetParent" : "Caretaker");

      console.log("Saving post...");
      await post.save();
      console.log("Post saved:", post);

      // Redirect to scroll view
      window.location.href = "../User_profiles_posting/scroll_view.html";

    } catch (error) {
      console.error("Error saving post:", error);
      alert("There was an issue uploading your post.");
    }
  });
});
