// Profile.js
document.addEventListener("DOMContentLoaded", async () => {
  if (typeof Parse === "undefined") {
    console.error("Parse SDK not loaded!");
    return;
  }

  // Get URL params for public profile view
  const urlParams = new URLSearchParams(window.location.search);
  const publicId = urlParams.get("id");
  const typeParam = urlParams.get("type");
  const isPublicView = !!publicId;

  const currentUser = Parse.User.current();

  // DOM elements
  const roleSelect = document.getElementById("roleSelect");
  const profileTabs = document.getElementById("profileTabs");
  const profileRoleTabs = document.getElementById("profileRoleTabs");
  const contentTabs = document.getElementById("contentTabs");

  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");
  const contentTabButtons = document.querySelectorAll(".content-tab-btn");
  const contentTabSections = document.querySelectorAll(".content-tab");

  const logoutBtn = document.getElementById("logoutBtn");
  // const bookBtn = document.getElementById("bookCaretaker");

  // Pet Parent elements
  const saveParentBtn = document.getElementById("saveProfile");
  const editParentBtn = document.getElementById("editProfile");
  const parentForm = document.getElementById("parentForm");
  const parentDisplay = document.getElementById("profileDisplay");
  const parentSection = document.getElementById("savedProfile");

  const parentPhotoInput = document.getElementById("parentPhoto");
  const dogPhotoInput = document.getElementById("dogPhoto");

  const parentPreview = document.createElement("div");
  parentPreview.classList.add("preview");
  parentPhotoInput.insertAdjacentElement("afterend", parentPreview);

  const dogPreview = document.createElement("div");
  dogPreview.classList.add("preview");
  dogPhotoInput.insertAdjacentElement("afterend", dogPreview);

  // Caretaker elements
  const saveCaretakerBtn = document.getElementById("saveCaretaker");
  const editCaretakerBtn = document.getElementById("editCaretaker");
  const caretakerForm = document.getElementById("caretakerForm");
  const caretakerDisplay = document.getElementById("caretakerDisplay");
  const caretakerSection = document.getElementById("savedCaretaker");
  const caretakerPhotoInput = document.getElementById("caretakerPhoto");

  const caretakerPreview = document.createElement("div");
  caretakerPreview.classList.add("preview");
  caretakerPhotoInput.insertAdjacentElement("afterend", caretakerPreview);

  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        await Parse.User.logOut();
      } catch (e) {
        console.error("Error during logout:", e);
      }
      window.location.href = "../User_login_signup/login.html";
    });
  }

  // Public profile view logic
  if (isPublicView) {
    roleSelect.classList.add("hidden");
    profileTabs.classList.remove("hidden");
    profileRoleTabs.classList.add("hidden");
    contentTabs.classList.remove("hidden");

    const PetParent = Parse.Object.extend("PetParent");
    const Caretaker = Parse.Object.extend("Caretaker");

    try {
      let profile = null;

      if (typeParam === "PetParent") {
        const parentQuery = new Parse.Query(PetParent);
        parentQuery.equalTo("objectId", publicId);
        profile = await parentQuery.first();
        if (profile) {
          showParentProfile(profile);
          loadUserPosts(profile.get("user").id); //load posts for public view
          loadUserFeedback(profile.get("user").id);
          console.log("🐶 profile user object:", profile.get("user"));
        }
      } else if (typeParam === "Caretaker") {
        const caretakerQuery = new Parse.Query(Caretaker);
        caretakerQuery.equalTo("objectId", publicId);
        profile = await caretakerQuery.first();
        if (profile) {
          showCaretakerProfile(profile);
          loadUserPosts(profile.get("user").id);
          loadUserFeedback(profile.get("user").id);
          console.log("🐶 profile user object:", profile.get("user"));
          // if (bookBtn) bookBtn.classList.remove("hidden");
        }
      }

      // fallback if type is missing
      if (!profile) {
        const fallbackParentQuery = new Parse.Query(PetParent);
        fallbackParentQuery.equalTo("objectId", publicId);
        profile = await fallbackParentQuery.first();
        if (profile) {
          showParentProfile(profile);
          loadUserPosts(profile.get("user").id);
          loadUserFeedback(profile.get("user").id);
          console.log("🐶 profile user object:", profile.get("user"));
        } else {
          const fallbackCaretakerQuery = new Parse.Query(Caretaker);
          fallbackCaretakerQuery.equalTo("objectId", publicId);
          profile = await fallbackCaretakerQuery.first();
          if (profile) {
            showCaretakerProfile(profile);
            loadUserPosts(profile.get("user").id);
            loadUserFeedback(profile.get("user").id);
            console.log("🐶 profile user object:", profile.get("user"));
            // if (bookBtn) bookBtn.classList.remove("hidden");
          }
        }
      }

      if (!profile) {
        alert("Profile not found.");
        console.error("No matching profile found for ID:", publicId);
      }
    } catch (e) {
      alert("Profile not found.");
      console.error(e);
    }

    // Tab switching for content tabs
    contentTabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.contentTab;
        contentTabButtons.forEach((b) => b.classList.remove("active"));
        contentTabSections.forEach((tab) => tab.classList.remove("active"));
        btn.classList.add("active");
        document.getElementById(target).classList.add("active");
      });

    });

    return; // Stop further execution for public view
  }

  // If not public view, require login
  if (!currentUser) {
    window.location.href = "../User_login_signup/login.html";
    return;
  }

  // Role selection
  document.getElementById("chooseParent").addEventListener("click", () => {
    showTab("parentTab");
    roleSelect.classList.add("hidden");
    profileTabs.classList.remove("hidden");
    parentForm.classList.remove("hidden");
    parentSection.classList.add("hidden");
    caretakerForm.classList.add("hidden");
    caretakerSection.classList.add("hidden");
  });

  document.getElementById("chooseCaretaker").addEventListener("click", () => {
    showTab("caretakerTab");
    roleSelect.classList.add("hidden");
    profileTabs.classList.remove("hidden");
    caretakerForm.classList.remove("hidden");
    caretakerSection.classList.add("hidden");
    parentForm.classList.add("hidden");
    parentSection.classList.add("hidden");
  });

  // Tab switching for profile tabs
  function showTab(tabId) {
    tabButtons.forEach((b) => b.classList.toggle("active", b.dataset.tab === tabId));
    tabContents.forEach((tab) => tab.classList.toggle("active", tab.id === tabId));

    if (!isPublicView) {
      if (tabId === "parentTab") {
        parentForm.classList.remove("hidden");
        caretakerForm.classList.add("hidden");
        parentSection.classList.add("hidden");
        caretakerSection.classList.add("hidden");
      } else if (tabId === "caretakerTab") {
        caretakerForm.classList.remove("hidden");
        parentForm.classList.add("hidden");
        caretakerSection.classList.add("hidden");
        parentSection.classList.add("hidden");
      }
    }
  }

  // Tab switching for content tabs
  contentTabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.contentTab;
      contentTabButtons.forEach((b) => b.classList.remove("active"));
      contentTabSections.forEach((tab) => tab.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(target).classList.add("active");
    });
  });

  // Image preview
  parentPhotoInput.addEventListener("change", () => previewImage(parentPhotoInput, parentPreview));
  dogPhotoInput.addEventListener("change", () => previewImage(dogPhotoInput, dogPreview));
  caretakerPhotoInput.addEventListener("change", () => previewImage(caretakerPhotoInput, caretakerPreview));

  function previewImage(input, previewDiv) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      previewDiv.innerHTML = `<img src="${reader.result}" class="circle-photo" alt="Preview">`;
    };
    reader.readAsDataURL(file);
  }

  // Save Pet Parent profile
  saveParentBtn.addEventListener("click", async () => {
    try {
      const PetParent = Parse.Object.extend("PetParent");
      const query = new Parse.Query(PetParent);
      query.equalTo("user", currentUser);
      const existing = await query.first();
      const petParent = existing || new PetParent();

      const parentPhotoFile = parentPhotoInput.files[0];
      const dogPhotoFile = dogPhotoInput.files[0];
      const parentPhoto = parentPhotoFile ? new Parse.File(parentPhotoFile.name, parentPhotoFile) : null;
      const dogPhoto = dogPhotoFile ? new Parse.File(dogPhotoFile.name, dogPhotoFile) : null;

      const acl = petParent.getACL() || new Parse.ACL(currentUser);
      acl.setPublicReadAccess(true);
      acl.setWriteAccess(currentUser, true);
      petParent.setACL(acl);

      petParent.set("user", currentUser);
      if (parentPhoto) petParent.set("photo", parentPhoto);
      if (dogPhoto) petParent.set("dogPhoto", dogPhoto);
      petParent.set("name", document.getElementById("parentName").value);
      petParent.set("zip", document.getElementById("parentZip").value);
      petParent.set("dogName", document.getElementById("dogName").value);
      petParent.set("dogAge", Number(document.getElementById("dogAge").value));
      petParent.set("dogBreed", document.getElementById("dogBreed").value);
      petParent.set("dogWeight", Number(document.getElementById("dogWeight").value));
      petParent.set("dogMeds", document.getElementById("dogMeds").value);
      petParent.set("dogHypo", document.getElementById("dogHypo").value);
      petParent.set("dogBio", document.getElementById("dogBio").value);

      await petParent.save();
      alert("Pet Parent Profile saved!");
      showParentProfile(petParent);
      profileRoleTabs.classList.add("hidden");
      contentTabs.classList.remove("hidden");
    } catch (err) {
      alert("Error saving profile: " + err.message);
      console.error(err);
    }
  });

  editParentBtn.addEventListener("click", async () => {
    const PetParent = Parse.Object.extend("PetParent");
    const query = new Parse.Query(PetParent);
    query.equalTo("user", currentUser);
    const profile = await query.first();
    if (!profile) return;

    document.getElementById("parentName").value = profile.get("name") || "";
    document.getElementById("parentZip").value = profile.get("zip") || "";
    document.getElementById("dogName").value = profile.get("dogName") || "";
    document.getElementById("dogAge").value = profile.get("dogAge") || "";
    document.getElementById("dogBreed").value = profile.get("dogBreed") || "";
    document.getElementById("dogWeight").value = profile.get("dogWeight") || "";
    document.getElementById("dogMeds").value = profile.get("dogMeds") || "";
    document.getElementById("dogHypo").value = profile.get("dogHypo") || "";
    document.getElementById("dogBio").value = profile.get("dogBio") || "";

    parentForm.classList.remove("hidden");
    parentSection.classList.add("hidden");
  });

  function showParentProfile(profileObj) {
    showTab("parentTab");
    const html = `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
        <div style="display: flex; align-items: center; gap: 20px;">
          ${profileObj.get("photo") ? `<img src="${profileObj.get("photo").url()}" class="circle-photo">` : ""}
          <div>
            <p><strong>Name:</strong> ${profileObj.get("name") || "—"}</p>
            <p><strong>Zip Code:</strong> ${profileObj.get("zip") || "—"}</p>
          </div>
        </div>
        <hr class="section-divider" />
        <div style="display: flex; align-items: center; gap: 20px;">
          ${profileObj.get("dogPhoto") ? `<img src="${profileObj.get("dogPhoto").url()}" class="circle-photo">` : ""}
          <div>
            <h3>Dog Information</h3>
            <p><strong>Name:</strong> ${profileObj.get("dogName") || "—"}</p>
            <p><strong>Age:</strong> ${profileObj.get("dogAge") || "—"}</p>
            <p><strong>Breed:</strong> ${profileObj.get("dogBreed") || "—"}</p>
            <p><strong>Weight:</strong> ${profileObj.get("dogWeight") || "—"} lbs</p>
            <p><strong>Medications:</strong> ${profileObj.get("dogMeds") || "—"}</p>
            <p><strong>Hypoallergenic:</strong> ${profileObj.get("dogHypo") || "—"}</p>
            <p><strong>Bio:</strong> ${profileObj.get("dogBio") || "—"}</p>
          </div>
        </div>
      </div>`;
    parentDisplay.innerHTML = html;
    parentForm.classList.add("hidden");
    parentSection.classList.remove("hidden");
    editParentBtn.classList.toggle("hidden", isPublicView);
  }

  // Save Caretaker profile
  saveCaretakerBtn.addEventListener("click", async () => {
    try {
      const Caretaker = Parse.Object.extend("Caretaker");
      const query = new Parse.Query(Caretaker);
      query.equalTo("user", currentUser);
      const existing = await query.first();
      const caretaker = existing || new Caretaker();

      const photoFile = caretakerPhotoInput.files[0];
      const photo = photoFile ? new Parse.File(photoFile.name, photoFile) : null;

      const acl = caretaker.getACL() || new Parse.ACL(currentUser);
      acl.setPublicReadAccess(true);
      acl.setWriteAccess(currentUser, true);
      caretaker.setACL(acl);

      caretaker.set("user", currentUser);
      if (photo) caretaker.set("photo", photo);
      caretaker.set("name", document.getElementById("caretakerName").value);
      caretaker.set("zip", document.getElementById("caretakerZip").value);
      caretaker.set("bio", document.getElementById("caretakerBio").value);
      caretaker.set("experience", document.getElementById("caretakerExp").value);
      caretaker.set("rate", Number(document.getElementById("caretakerRate").value));

      await caretaker.save();
      alert("Caretaker Profile saved!");
      showCaretakerProfile(caretaker);
      profileRoleTabs.classList.add("hidden");
      contentTabs.classList.remove("hidden");
      // if (bookBtn) bookBtn.classList.remove("hidden");
    } catch (err) {
      alert("Error saving caretaker: " + err.message);
      console.error(err);
    }
  });

  editCaretakerBtn.addEventListener("click", async () => {
    const Caretaker = Parse.Object.extend("Caretaker");
    const query = new Parse.Query(Caretaker);
    query.equalTo("user", currentUser);
    const profile = await query.first();
    if (!profile) return;

    document.getElementById("caretakerName").value = profile.get("name") || "";
    document.getElementById("caretakerZip").value = profile.get("zip") || "";
    document.getElementById("caretakerBio").value = profile.get("bio") || "";
    document.getElementById("caretakerExp").value = profile.get("experience") || "";
    document.getElementById("caretakerRate").value = profile.get("rate") || "";

    caretakerForm.classList.remove("hidden");
    caretakerSection.classList.add("hidden");
  });

  function showCaretakerProfile(profileObj) {
    showTab("caretakerTab");
    const html = `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
        <div style="display: flex; align-items: center; gap: 20px;">
          ${profileObj.get("photo") ? `<img src="${profileObj.get("photo").url()}" class="circle-photo">` : ""}
          <div>
            <h3>Caretaker Information</h3>
            <p><strong>Name:</strong> ${profileObj.get("name") || "—"}</p>
            <p><strong>Zip Code:</strong> ${profileObj.get("zip") || "—"}</p>
            <p><strong>Bio:</strong> ${profileObj.get("bio") || "—"}</p>
            <p><strong>Experience:</strong> ${profileObj.get("experience") || "—"}</p>
            <p><strong>Rate:</strong> $${profileObj.get("rate") || "—"} / hr</p>
          </div>
        </div>
      </div>`;
    caretakerDisplay.innerHTML = html;
    caretakerForm.classList.add("hidden");
    caretakerSection.classList.remove("hidden");
    editCaretakerBtn.classList.toggle("hidden", isPublicView);
  }

  // Load existing user profile if present (only for private view)
  if (currentUser && !isPublicView) {
    const PetParent = Parse.Object.extend("PetParent");
    const Caretaker = Parse.Object.extend("Caretaker");

    const parentQuery = new Parse.Query(PetParent).equalTo("user", currentUser);
    const caretakerQuery = new Parse.Query(Caretaker).equalTo("user", currentUser);

    const [parentProfile, caretakerProfile] = await Promise.all([
      parentQuery.first(),
      caretakerQuery.first()
    ]);

    if (parentProfile) {
      showParentProfile(parentProfile);
      // loadUserPosts(currentUser.id);
      loadUserFeedback();
      roleSelect.classList.add("hidden");
      profileTabs.classList.remove("hidden");
      profileRoleTabs.classList.add("hidden");
      contentTabs.classList.remove("hidden");
    } else if (caretakerProfile) {
      showCaretakerProfile(caretakerProfile);
      // loadUserPosts(currentUser.id);
      loadUserFeedback();
      roleSelect.classList.add("hidden");
      profileTabs.classList.remove("hidden");
      profileRoleTabs.classList.add("hidden");
      contentTabs.classList.remove("hidden");
      // if (bookBtn) bookBtn.classList.remove("hidden");
    } else {
      roleSelect.classList.remove("hidden");
    }
  }

  // Profile tab button switching (Pet Parent / Caretaker)
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.dataset.tab;
      showTab(tabId);
    });
  });

  // Posts/Feedback content tab switching
  contentTabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.contentTab;
      contentTabButtons.forEach((b) => b.classList.remove("active"));
      contentTabSections.forEach((tab) => tab.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(target).classList.add("active");
    });
  });


  // "Go to Post Page" button 
  const postBtn = document.getElementById("goToPostPage");
  if (postBtn && !isPublicView) {
    postBtn.addEventListener("click", () => {
      window.location.href = "../User_profiles_posting/post.html";
    });
  } else if (postBtn && isPublicView) {
    postBtn.classList.add("hidden"); // hiding from public view
  }

  // Function for loading the users posts into post tab
  async function loadUserPosts(userId = null) {
    const Post = Parse.Object.extend("Post");
    const query = new Parse.Query(Post);
    query.include("user");
    query.descending("createdAt");

    const container = document.getElementById("userPostsContainer");
    container.innerHTML = "";

    try {
      if (userId) {
        const userPointer = new Parse.User();
        userPointer.id = userId;
        query.equalTo("user", userPointer);
      } else if (currentUser) {
        query.equalTo("user", currentUser);
      } else {
        return;
      }

      const posts = await query.find();

      if (posts.length === 0) {
        container.innerHTML = "<p>No posts yet.</p>";
        return;
      }

      posts.forEach((post) => {
        const photo = post.get("photo");
        const caption = post.get("caption");
        const timeStamp = post.get("timeStamp");

        if (!photo || !caption || !timeStamp) return;

        const card = document.createElement("div");
        card.className = "post-card";

        const img = document.createElement("img");
        img.src = photo.url();
        img.alt = "Dog Photo";
        img.className = "post-photo";

        const captionP = document.createElement("p");
        captionP.textContent = caption;

        const dateP = document.createElement("p");
        dateP.className = "timestamp";
        dateP.textContent = new Date(timeStamp).toLocaleString();

        card.appendChild(img);
        card.appendChild(captionP);
        card.appendChild(dateP);

        // Show delete button only in private view
        if (!isPublicView) {
          const delBtn = document.createElement("button");
          delBtn.className = "btn small-btn olive";
          delBtn.textContent = "Delete Post";
          delBtn.addEventListener("click", async () => {
            const confirmDelete = confirm("Are you sure you want to delete this post?");
            if (!confirmDelete) return;
            try {
              await post.destroy();
              card.remove();
            } catch (err) {
              alert("Failed to delete post.");
              console.error("Delete error:", err);
            }
          });
          card.appendChild(delBtn);
        }

        container.appendChild(card);
      });
    } catch (err) {
      console.error("Error loading posts:", err);
    }
  }


  // Feedback tab: Load feedback into feedback tab
  async function loadUserFeedback(userId) {
    userId = userId || (currentUser && currentUser.id);
    if (!userId) return;

    const Feedback = Parse.Object.extend("Feedback");
    const query = new Parse.Query(Feedback);

    console.log("🔍 Loading feedback for userId:", userId);

    const pointer = new Parse.User();
    pointer.id = userId;

    query.equalTo("target", pointer);


    query.equalTo("target", pointer);
    query.include("author");
    query.descending("createdAt");

    try {
      const results = await query.find();
      console.log(`📦 Found ${results.length} feedback entries`);
      renderFeedbackOnProfile(results);
    } catch (e) {
      console.error("❌ Error loading feedback:", e);
    }
  }


  function renderFeedbackOnProfile(feedbacks) {
    const container = document.getElementById("feedbackContainer");
    container.innerHTML = "";

    if (!feedbacks || feedbacks.length === 0) {
      container.innerHTML = "<p>No feedback yet.</p>";
      return;
    }

    console.log(`🎨 Rendering ${feedbacks.length} feedback entries`);

    feedbacks.forEach((entry, i) => {
      try {

        const authorPointer = entry.get("author");
        let author = "Anonymous";

        try {
          if (authorPointer && typeof authorPointer.get === "function") {
            const uname = authorPointer.get("username");
            if (uname) author = uname;
          } else if (typeof authorPointer === "object" && authorPointer.id) {
            author = `User ${authorPointer.id}`; // fallback to objectId
          }
        } catch (e) {
          console.warn("⚠️ Failed to get author username", e);
        }


        const role = entry.get("role") || "—";
        const rating = entry.get("rating") || 0;
        const text = entry.get("text") || "";
        const createdAt = entry.createdAt;

        const card = document.createElement("div");
        card.className = "feedback-card";

        card.innerHTML = `
        <p><strong>${author}</strong> (${role})</p>
        <p>${"⭐".repeat(rating)} (${rating}/5)</p>
        <p>${text}</p>
        <small>${new Date(createdAt).toLocaleString()}</small>
        <hr />
      `;

        container.appendChild(card);
      } catch (err) {
        console.error(`❌ Failed to render feedback #${i + 1}`, err);
      }
    });
  }

  // Call loadUserPosts when script is loaded
  loadUserPosts();
  loadUserFeedback();

});


