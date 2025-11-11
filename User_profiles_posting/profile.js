// Profile.js — Final Back4App-integrated version
document.addEventListener("DOMContentLoaded", async () => {
  // Ensure Parse is initialized
  if (typeof Parse === "undefined") {
    console.error("Parse SDK not loaded!");
    return;
  }

  const currentUser = Parse.User.current();
  if (!currentUser) {
    alert("Please log in first.");
    window.location.href = "../User_login_signup/login.html";
    return;
  }

  // Logout
  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn.addEventListener("click", async () => {
    await Parse.User.logOut();
    window.location.href = "../User_login_signup/login.html";
  });

  // Elements
  const roleSelect = document.getElementById("roleSelect");
  const profileTabs = document.getElementById("profileTabs");
  const profileRoleTabs = document.getElementById("profileRoleTabs");
  const contentTabs = document.getElementById("contentTabs");
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");
  const bookBtn = document.getElementById("bookCaretaker");

  // Role Selection
  document.getElementById("chooseParent").addEventListener("click", () => showTab("parentTab"));
  document.getElementById("chooseCaretaker").addEventListener("click", () => showTab("caretakerTab"));

  function showTab(tabId) {
    roleSelect.classList.add("hidden");
    profileTabs.classList.remove("hidden");
    tabButtons.forEach((b) => b.classList.toggle("active", b.dataset.tab === tabId));
    tabContents.forEach((tab) => tab.classList.toggle("active", tab.id === tabId));
  }

  // -Pet Parent Logic
  const saveParentBtn = document.getElementById("saveProfile");
  const editParentBtn = document.getElementById("editProfile");
  const parentForm = document.getElementById("parentForm");
  const parentDisplay = document.getElementById("profileDisplay");
  const parentSection = document.getElementById("savedProfile");

  saveParentBtn.addEventListener("click", async () => {
    try {
      const PetParent = Parse.Object.extend("PetParent");
      const query = new Parse.Query(PetParent);
      query.equalTo("user", currentUser);
      const existing = await query.first();

      const petParent = existing || new PetParent();

      // Photos
      const parentPhotoFile = document.getElementById("parentPhoto").files[0];
      const dogPhotoFile = document.getElementById("dogPhoto").files[0];
      const parentPhoto = parentPhotoFile ? new Parse.File(parentPhotoFile.name, parentPhotoFile) : null;
      const dogPhoto = dogPhotoFile ? new Parse.File(dogPhotoFile.name, dogPhotoFile) : null;

      // Assigning fields
      petParent.set("user", currentUser);
      if (parentPhoto) petParent.set("photo", parentPhoto);
      petParent.set("name", document.getElementById("parentName").value);
      petParent.set("zipCode", document.getElementById("parentZip").value);
      if (dogPhoto) petParent.set("dogPhoto", dogPhoto);
      petParent.set("dogName", document.getElementById("dogName").value);
      petParent.set("dogAge", Number(document.getElementById("dogAge").value));
      petParent.set("dogBreed", document.getElementById("dogBreed").value);
      petParent.set("dogWeight", Number(document.getElementById("dogWeight").value));
      petParent.set("dogMeds", document.getElementById("dogMeds").value);
      petParent.set("dogHypo", document.getElementById("dogHypo").value);
      petParent.set("bio", document.getElementById("dogBio").value);

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

  // Display Pet Parent
  function showParentProfile(profileObj) {
    const html = `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
        <div style="display: flex; align-items: center; gap: 20px;">
          ${profileObj.get("photo") ? `<img src="${profileObj.get("photo").url()}" class="circle-photo">` : ""}
          <div>
            <p><strong>Name:</strong> ${profileObj.get("name") || "—"}</p>
            <p><strong>Zip Code:</strong> ${profileObj.get("zipCode") || "—"}</p>
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
            <p><strong>Bio:</strong> ${profileObj.get("bio") || "—"}</p>
          </div>
        </div>
      </div>`;
    parentDisplay.innerHTML = html;
    parentForm.classList.add("hidden");
    parentSection.classList.remove("hidden");
  }

  // Caretaker Logic
  const saveCaretakerBtn = document.getElementById("saveCaretaker");
  const editCaretakerBtn = document.getElementById("editCaretaker");
  const caretakerForm = document.getElementById("caretakerForm");
  const caretakerDisplay = document.getElementById("caretakerDisplay");
  const caretakerSection = document.getElementById("savedCaretaker");

  saveCaretakerBtn.addEventListener("click", async () => {
    try {
      const Caretaker = Parse.Object.extend("Caretaker");
      const query = new Parse.Query(Caretaker);
      query.equalTo("user", currentUser);
      const existing = await query.first();

      const caretaker = existing || new Caretaker();
      const caretakerPhotoFile = document.getElementById("caretakerPhoto").files[0];
      const caretakerPhoto = caretakerPhotoFile ? new Parse.File(caretakerPhotoFile.name, caretakerPhotoFile) : null;

      caretaker.set("user", currentUser);
      if (caretakerPhoto) caretaker.set("photo", caretakerPhoto);
      caretaker.set("name", document.getElementById("caretakerName").value);
      caretaker.set("zipCode", document.getElementById("caretakerZip").value);
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

  // Display Caretaker
  function showCaretakerProfile(profileObj) {
    const html = `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
        <div style="display: flex; align-items: center; gap: 20px;">
          ${profileObj.get("photo") ? `<img src="${profileObj.get("photo").url()}" class="circle-photo">` : ""}
          <div>
            <h3>Caretaker Information</h3>
            <p><strong>Name:</strong> ${profileObj.get("name") || "—"}</p>
            <p><strong>Zip Code:</strong> ${profileObj.get("zipCode") || "—"}</p>
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

  // Load exisiting profiles 
  async function loadExistingProfiles() {
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

  loadExistingProfiles();
});
