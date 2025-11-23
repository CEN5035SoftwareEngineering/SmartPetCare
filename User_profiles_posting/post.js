// post.js 
document.addEventListener("DOMContentLoaded", async () => {

  if (typeof Parse === "undefined") {
    console.error("Parse SDK not loaded!");
    return;
  }

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

      console.log("📸 Uploading file:", photoInput.name);
      const photoFile = new Parse.File(photoInput.name, photoInput);
      await photoFile.save();
      console.log("File successfully uploaded:", photoFile.url());

      // // Determine profile type BEFORE saving the post
      // let profileType = "Caretaker";
      // const PetParent = Parse.Object.extend("PetParent");
      // const parentQuery = new Parse.Query(PetParent);
      // parentQuery.equalTo("user", currentUser);
      // const parentProfile = await parentQuery.first();

      // if (parentProfile) {
      //   profileType = "PetParent";
      // }

      // Determine profile type BEFORE saving the post
      let profileType = null;

      const PetParent = Parse.Object.extend("PetParent");
      const Caretaker = Parse.Object.extend("Caretaker");

      // Check PetParent profile
      const parentQuery = new Parse.Query(PetParent);
      parentQuery.equalTo("user", currentUser);
      const parentProfile = await parentQuery.first();

      // Check Caretaker profile
      const caretakerQuery = new Parse.Query(Caretaker);
      caretakerQuery.equalTo("user", currentUser);
      const caretakerProfile = await caretakerQuery.first();

      // Assign correct type based on actual profile
      profileType = parentProfile ? "PetParent" : "Caretaker";


      // ACL
      const acl = new Parse.ACL(currentUser);
      acl.setPublicReadAccess(true);
      acl.setWriteAccess(currentUser, true);
      post.setACL(acl);

      // Set all fields before saving profile
      post.set("user", currentUser);
      post.set("userId", currentUser.id);
      post.set("username", currentUser.get("username"));
      post.set("caption", caption);
      post.set("photo", photoFile);
      post.set("profileType", profileType);
      post.set("timeStamp", new Date());

      await post.save();
      console.log("Post saved:", post);

      window.location.href = "../User_profiles_posting/scroll_view.html";

    } catch (error) {
      console.error("Error saving post:", error);
      alert("There was an issue uploading your post.");
    }
  });
});
