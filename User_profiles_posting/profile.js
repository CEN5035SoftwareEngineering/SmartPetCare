// Profile.js — Final Back4App-integrated with full public profile, edit, and photo preview logic
document.addEventListener("DOMContentLoaded", async () => {
  if (typeof Parse === "undefined") {
    console.error("Parse SDK not loaded!");
    return;
  }

  const currentUser = Parse.User.current();
  const urlParams = new URLSearchParams(window.location.search);
  const publicId = urlParams.get("id");
  const isPublicView = !!publicId;

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
  const bookBtn = document.getElementById("bookCaretaker");

  // Public Profile View 
  if (isPublicView) {
    profileTabs.classList.add("hidden");
    roleSelect.classList.add("hidden");
    contentTabs.classList.remove("hidden");

    const PetParent = Parse.Object.extend("PetParent");
    const Caretaker = Parse.Object.extend("Caretaker");

    const parentQuery = new Parse.Query(PetParent);
    const caretakerQuery = new Parse.Query(Caretaker);

    try {
      const parentProfile = await parentQuery.get(publicId);
      showParentProfile(parentProfile);
    } catch (e1) {
      try {
        const caretakerProfile = await caretakerQuery.get(publicId);
        showCaretakerProfile(caretakerProfile);
        bookBtn.classList.remove("hidden");
      } catch (e2) {
        alert("Profile not found.");
        console.error(e2);
      }
    }
    return;
  }

  // Logout 
  logoutBtn.addEventListener("click", async () => {
    await Parse.User.logOut();
    window.location.href = "../User_login_signup/login.html";
  });

  // Role Selection  
  document.getElementById("chooseParent").addEventListener("click", () => {
    showTab("parentTab");
    roleSelect.classList.add("hidden");
    profileTabs.classList.remove("hidden");
  });

  document.getElementById("chooseCaretaker").addEventListener("click", () => {
    showTab("caretakerTab");
    roleSelect.classList.add("hidden");
    profileTabs.classList.remove("hidden");
  });

  function showTab(tabId) {
    tabButtons.forEach((b) => b.classList.toggle("active", b.dataset.tab === tabId));
    tabContents.forEach((tab) => tab.classList.toggle("active", tab.id === tabId));
  }

  // Post/Feedback tabs
  contentTabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.contentTab;
      contentTabButtons.forEach((b) => b.classList.remove("active"));
      contentTabSections.forEach((tab) => tab.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(target).classList.add("active");
    });
  });

  // Pet Parent  
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

  parentPhotoInput.addEventListener("change", () => previewImage(parentPhotoInput, parentPreview));
  dogPhotoInput.addEventListener("change", () => previewImage(dogPhotoInput, dogPreview));

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
  }

  // Caretaker  
  const saveCaretakerBtn = document.getElementById("saveCaretaker");
  const editCaretakerBtn = document.getElementById("editCaretaker");
  const caretakerForm = document.getElementById("caretakerForm");
  const caretakerDisplay = document.getElementById("caretakerDisplay");
  const caretakerSection = document.getElementById("savedCaretaker");
  const caretakerPhotoInput = document.getElementById("caretakerPhoto");

  const caretakerPreview = document.createElement("div");
  caretakerPreview.classList.add("preview");
  caretakerPhotoInput.insertAdjacentElement("afterend", caretakerPreview);
  caretakerPhotoInput.addEventListener("change", () => previewImage(caretakerPhotoInput, caretakerPreview));

  saveCaretakerBtn.addEventListener("click", async () => {
    try {
      const Caretaker = Parse.Object.extend("Caretaker");
      const query = new Parse.Query(Caretaker);
      query.equalTo("user", currentUser);
      const existing = await query.first();
      const caretaker = existing || new Caretaker();

      const photoFile = caretakerPhotoInput.files[0];
      const photo = photoFile ? new Parse.File(photoFile.name, photoFile) : null;

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
      bookBtn.classList.remove("hidden");
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
  }

  function previewImage(input, previewDiv) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      previewDiv.innerHTML = `<img src="${reader.result}" class="circle-photo" alt="Preview">`;
    };
    reader.readAsDataURL(file);
  }

  // If user already has a profile
  if (currentUser) {
    const PetParent = Parse.Object.extend("PetParent");
    const Caretaker = Parse.Object.extend("Caretaker");

    const parentQuery = new Parse.Query(PetParent);
    parentQuery.equalTo("user", currentUser);
    const caretakerQuery = new Parse.Query(Caretaker);
    caretakerQuery.equalTo("user", currentUser);

    const [parentProfile, caretakerProfile] = await Promise.all([
      parentQuery.first(),
      caretakerQuery.first()
    ]);

    if (parentProfile) {
      showParentProfile(parentProfile);
      roleSelect.classList.add("hidden");
      profileTabs.classList.remove("hidden");
      profileRoleTabs.classList.add("hidden");
      contentTabs.classList.remove("hidden");
    } else if (caretakerProfile) {
      showCaretakerProfile(caretakerProfile);
      roleSelect.classList.add("hidden");
      profileTabs.classList.remove("hidden");
      profileRoleTabs.classList.add("hidden");
      contentTabs.classList.remove("hidden");
      bookBtn.classList.remove("hidden");
    }
  }
});

//connect to the posting page
document.getElementById('goToPostPage').addEventListener('click', () => {
  window.location.href = '../User_profiles_posting/post.html'; // Adjust path if needed
});
