// Profile.js
document.addEventListener("DOMContentLoaded", () => {

  // --- PET PARENT SAVE ---
  const saveParentBtn = document.getElementById("saveProfile");
  saveParentBtn?.addEventListener("click", async () => {
    const name = document.getElementById("parentName").value;
    const zip = document.getElementById("parentZip").value;
    const dogName = document.getElementById("dogName").value;
    const dogAge = parseInt(document.getElementById("dogAge").value);
    const dogBreed = document.getElementById("dogBreed").value;
    const dogWeight = parseFloat(document.getElementById("dogWeight").value);
    const dogMeds = document.getElementById("dogMeds").value;
    const dogHypo = document.getElementById("dogHypo").value;
    const dogBio = document.getElementById("dogBio").value;
    const photoFile = document.getElementById("parentPhoto").files[0];
    const dogPhotoFile = document.getElementById("dogPhoto").files[0];

    try {
      const ParentProfile = Parse.Object.extend("ParentProfile");
      const parentProfile = new ParentProfile();

      parentProfile.set("name", name);
      parentProfile.set("zip", zip);
      parentProfile.set("dogName", dogName);
      parentProfile.set("dogAge", dogAge);
      parentProfile.set("dogBreed", dogBreed);
      parentProfile.set("dogWeight", dogWeight);
      parentProfile.set("dogMeds", dogMeds);
      parentProfile.set("dogHypo", dogHypo);
      parentProfile.set("dogBio", dogBio);

      if (photoFile) {
        const parsePhoto = new Parse.File(photoFile.name, photoFile);
        parentProfile.set("photo", parsePhoto);
      }
      if (dogPhotoFile) {
        const parseDogPhoto = new Parse.File(dogPhotoFile.name, dogPhotoFile);
        parentProfile.set("dogPhoto", parseDogPhoto);
      }

      await parentProfile.save();
      alert("Pet Parent profile saved successfully!");
    } catch (error) {
      alert("Error saving parent profile: " + error.message);
    }
  });

  // --- CARETAKER SAVE ---
  const saveCaretakerBtn = document.getElementById("saveCaretaker");
  saveCaretakerBtn?.addEventListener("click", async () => {
    const name = document.getElementById("caretakerName").value;
    const zip = document.getElementById("caretakerZip").value;
    const bio = document.getElementById("caretakerBio").value;
    const exp = document.getElementById("caretakerExp").value;
    const rate = parseFloat(document.getElementById("caretakerRate").value);
    const photoFile = document.getElementById("caretakerPhoto").files[0];

    try {
      const CaretakerProfile = Parse.Object.extend("CaretakerProfile");
      const caretakerProfile = new CaretakerProfile();

      caretakerProfile.set("name", name);
      caretakerProfile.set("zip", zip);
      caretakerProfile.set("bio", bio);
      caretakerProfile.set("experience", exp);
      caretakerProfile.set("rate", rate);

      if (photoFile) {
        const parsePhoto = new Parse.File(photoFile.name, photoFile);
        caretakerProfile.set("photo", parsePhoto);
      }

      await caretakerProfile.save();
      alert("Caretaker profile saved successfully!");
    } catch (error) {
      alert("Error saving caretaker profile: " + error.message);
    }
  });

  // --- LOAD EXISTING PROFILES (optional on page load) ---
  async function loadProfiles() {
    const ParentProfile = Parse.Object.extend("ParentProfile");
    const queryParent = new Parse.Query(ParentProfile);
    const parentResults = await queryParent.find();

    const CaretakerProfile = Parse.Object.extend("CaretakerProfile");
    const queryCaretaker = new Parse.Query(CaretakerProfile);
    const caretakerResults = await queryCaretaker.find();

    console.log("Loaded Parent Profiles:", parentResults);
    console.log("Loaded Caretaker Profiles:", caretakerResults);
  }

  loadProfiles();

  // --- LOGOUT ---
  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn?.addEventListener("click", async () => {
    await Parse.User.logOut();
    window.location.href = "../index.html";
  });
});

// // Profile.js — Handles saving, displaying, and showing uploaded photos
// document.addEventListener("DOMContentLoaded", () => {
//   // Role & view logic
//   const roleSelect = document.getElementById("roleSelect");
//   const profileTabs = document.getElementById("profileTabs");
//   const tabButtons = document.querySelectorAll(".tab-btn");
//   const tabContents = document.querySelectorAll(".tab-content");
//   const profileRoleTabs = document.getElementById("profileRoleTabs");
//   const contentTabs = document.getElementById("contentTabs");
//   const contentTabBtns = document.querySelectorAll(".content-tab-btn");
//   const contentTabSections = document.querySelectorAll(".content-tab");

//   const logoutBtn = document.getElementById("logoutBtn");
//   const bookBtn = document.getElementById("bookCaretaker");

//   const urlParams = new URLSearchParams(window.location.search);
//   const publicId = urlParams.get("id");
//   const isPublicView = !!publicId;

//   const role = localStorage.getItem("userRole");
//   const parentData = localStorage.getItem("petParentProfile");
//   const caretakerData = localStorage.getItem("caretakerProfile");

//   // Public profile view
//   if (isPublicView) {
//     profileTabs.classList.add("hidden");
//     roleSelect.classList.add("hidden");
//     contentTabs.classList.remove("hidden");

//     if (caretakerData) {
//       showCaretakerProfile(JSON.parse(caretakerData));
//       bookBtn.classList.remove("hidden");
//     } else if (parentData) {
//       showParentProfile(JSON.parse(parentData));
//     }
//     return;
//   }

//   // Logout button
//   logoutBtn.addEventListener("click", () => {
//     localStorage.clear();
//     window.location.href = "profile.html"; // reset page
//   });

//   // Load saved profile if exists
//   if (role === "petParent" && parentData) {
//     roleSelect.classList.add("hidden");
//     profileTabs.classList.remove("hidden");
//     profileRoleTabs.classList.add("hidden");
//     showTab("parentTab");
//     showParentProfile(JSON.parse(parentData));
//     contentTabs.classList.remove("hidden");
//   } else if (role === "caretaker" && caretakerData) {
//     roleSelect.classList.add("hidden");
//     profileTabs.classList.remove("hidden");
//     profileRoleTabs.classList.add("hidden");
//     showTab("caretakerTab");
//     showCaretakerProfile(JSON.parse(caretakerData));
//     bookBtn.classList.remove("hidden");
//     contentTabs.classList.remove("hidden");
//   }

//   // Tab switching (parent vs caretaker)
//   tabButtons.forEach((btn) => {
//     btn.addEventListener("click", () => showTab(btn.dataset.tab));
//   });

//   function showTab(tabId) {
//     tabButtons.forEach((b) => b.classList.toggle("active", b.dataset.tab === tabId));
//     tabContents.forEach((tab) => tab.classList.toggle("active", tab.id === tabId));
//   }

//   // Content Tabs - Posts vs Feedback
//   contentTabBtns.forEach((btn) => {
//     btn.addEventListener("click", () => {
//       const target = btn.dataset.contentTab;
//       contentTabBtns.forEach((b) => b.classList.toggle("active", b.dataset.contentTab === target));
//       contentTabSections.forEach((s) => s.classList.toggle("active", s.id === target));
//     });
//   });

//   // Role selection logic
//   document.getElementById("chooseParent").addEventListener("click", () => {
//     localStorage.setItem("userRole", "petParent");
//     roleSelect.classList.add("hidden");
//     profileTabs.classList.remove("hidden");
//     showTab("parentTab");
//   });

//   document.getElementById("chooseCaretaker").addEventListener("click", () => {
//     localStorage.setItem("userRole", "caretaker");
//     roleSelect.classList.add("hidden");
//     profileTabs.classList.remove("hidden");
//     showTab("caretakerTab");
//   });

//   // -----------------------
//   // Pet Parent logic
//   const saveBtn = document.getElementById("saveProfile");
//   const editBtn = document.getElementById("editProfile");
//   const form = document.getElementById("parentForm");
//   const displaySection = document.getElementById("savedProfile");
//   const displayDiv = document.getElementById("profileDisplay");
//   const parentPhotoInput = document.getElementById("parentPhoto");
//   const dogPhotoInput = document.getElementById("dogPhoto");

//   const parentPreview = document.createElement("div");
//   parentPreview.classList.add("preview");
//   parentPhotoInput.insertAdjacentElement("afterend", parentPreview);

//   const dogPreview = document.createElement("div");
//   dogPreview.classList.add("preview");
//   dogPhotoInput.insertAdjacentElement("afterend", dogPreview);

//   parentPhotoInput.addEventListener("change", () => previewImage(parentPhotoInput, parentPreview, false));
//   dogPhotoInput.addEventListener("change", () => previewImage(dogPhotoInput, dogPreview, true));

//   if (parentData && !isPublicView) {
//     showParentProfile(JSON.parse(parentData));
//   }

//   saveBtn.addEventListener("click", async () => {
//     const parentPhotoData = await getBase64(parentPhotoInput.files[0]);
//     const dogPhotoData = await getBase64(dogPhotoInput.files[0]);

//     const parentProfile = {
//       parentName: document.getElementById("parentName").value,
//       parentZip: document.getElementById("parentZip").value,
//       parentPhoto: parentPhotoData || "",
//       dogName: document.getElementById("dogName").value,
//       dogAge: document.getElementById("dogAge").value,
//       dogBreed: document.getElementById("dogBreed").value,
//       dogWeight: document.getElementById("dogWeight").value,
//       dogMeds: document.getElementById("dogMeds").value,
//       dogHypo: document.getElementById("dogHypo").value,
//       dogBio: document.getElementById("dogBio").value,
//       dogPhoto: dogPhotoData || ""
//     };

//     localStorage.setItem("petParentProfile", JSON.stringify(parentProfile));
//     showParentProfile(parentProfile);
//     contentTabs.classList.remove("hidden");
//     profileRoleTabs.classList.add("hidden");
//   });

//   editBtn.addEventListener("click", () => {
//     const savedData = JSON.parse(localStorage.getItem("petParentProfile"));
//     if (!savedData) return;
//     document.getElementById("parentName").value = savedData.parentName;
//     document.getElementById("parentZip").value = savedData.parentZip;
//     document.getElementById("dogName").value = savedData.dogName;
//     document.getElementById("dogAge").value = savedData.dogAge;
//     document.getElementById("dogBreed").value = savedData.dogBreed;
//     document.getElementById("dogWeight").value = savedData.dogWeight;
//     document.getElementById("dogMeds").value = savedData.dogMeds;
//     document.getElementById("dogHypo").value = savedData.dogHypo;
//     document.getElementById("dogBio").value = savedData.dogBio;

//     form.classList.remove("hidden");
//     displaySection.classList.add("hidden");
//   });

//   function showParentProfile(data) {
//     let html = `
//       <div style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
//         <div style="display: flex; align-items: center; gap: 20px;">
//           ${data.parentPhoto ? `<img src="${data.parentPhoto}" alt="Parent Photo" class="circle-photo">` : ""}
//           <div>
//             <p><strong>Name:</strong> ${data.parentName || "—"}</p>
//             <p><strong>Zip Code:</strong> ${data.parentZip || "—"}</p>
//           </div>
//         </div>
//         <hr class="section-divider" style="width: 100%; border-top: 1px solid #ccc;" />
//         <div style="display: flex; align-items: center; gap: 20px;">
//           ${data.dogPhoto ? `<img src="${data.dogPhoto}" alt="Dog Photo" class="circle-photo">` : ""}
//           <div>
//             <h3>Dog Information</h3>
//             <p><strong>Name:</strong> ${data.dogName || "—"}</p>
//             <p><strong>Age:</strong> ${data.dogAge || "—"}</p>
//             <p><strong>Breed:</strong> ${data.dogBreed || "—"}</p>
//             <p><strong>Weight:</strong> ${data.dogWeight || "—"} lbs</p>
//             <p><strong>Medications:</strong> ${data.dogMeds || "—"}</p>
//             <p><strong>Hypoallergenic:</strong> ${data.dogHypo || "—"}</p>
//             <p><strong>Bio:</strong> ${data.dogBio || "—"}</p>
//           </div>
//         </div>
//       </div>
//     `;
//     displayDiv.innerHTML = html;
//     form.classList.add("hidden");
//     displaySection.classList.remove("hidden");
//   }

//   // -----------------------
//   // Caretaker logic
//   const saveCaretakerBtn = document.getElementById("saveCaretaker");
//   const editCaretakerBtn = document.getElementById("editCaretaker");
//   const caretakerForm = document.getElementById("caretakerForm");
//   const caretakerDisplaySection = document.getElementById("savedCaretaker");
//   const caretakerDisplayDiv = document.getElementById("caretakerDisplay");
//   const caretakerPhotoInput = document.getElementById("caretakerPhoto");

//   const caretakerPreview = document.createElement("div");
//   caretakerPreview.classList.add("preview");
//   caretakerPhotoInput.insertAdjacentElement("afterend", caretakerPreview);
//   caretakerPhotoInput.addEventListener("change", () => previewImage(caretakerPhotoInput, caretakerPreview, false));

//   if (caretakerData && !isPublicView) {
//     showCaretakerProfile(JSON.parse(caretakerData));
//     bookBtn.classList.remove("hidden");
//   }

//   saveCaretakerBtn.addEventListener("click", async () => {
//     const caretakerPhotoData = await getBase64(caretakerPhotoInput.files[0]);

//     const caretakerProfile = {
//       caretakerName: document.getElementById("caretakerName").value,
//       caretakerZip: document.getElementById("caretakerZip").value,
//       caretakerBio: document.getElementById("caretakerBio").value,
//       caretakerExp: document.getElementById("caretakerExp").value,
//       caretakerRate: document.getElementById("caretakerRate").value,
//       caretakerPhoto: caretakerPhotoData || ""
//     };

//     localStorage.setItem("caretakerProfile", JSON.stringify(caretakerProfile));
//     showCaretakerProfile(caretakerProfile);
//     contentTabs.classList.remove("hidden");
//     profileRoleTabs.classList.add("hidden");
//   });

//   editCaretakerBtn.addEventListener("click", () => {
//     const savedData = JSON.parse(localStorage.getItem("caretakerProfile"));
//     if (!savedData) return;
//     document.getElementById("caretakerName").value = savedData.caretakerName;
//     document.getElementById("caretakerZip").value = savedData.caretakerZip;
//     document.getElementById("caretakerBio").value = savedData.caretakerBio;
//     document.getElementById("caretakerExp").value = savedData.caretakerExp;
//     document.getElementById("caretakerRate").value = savedData.caretakerRate;

//     caretakerForm.classList.remove("hidden");
//     caretakerDisplaySection.classList.add("hidden");
//   });

//   function showCaretakerProfile(data) {
//     let html = `
//       <div style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
//         <div style="display: flex; align-items: center; gap: 20px;">
//           ${data.caretakerPhoto ? `<img src="${data.caretakerPhoto}" alt="Caretaker Photo" class="circle-photo">` : ""}
//           <div>
//             <h3>Caretaker Information</h3>
//             <p><strong>Name:</strong> ${data.caretakerName || "—"}</p>
//             <p><strong>Zip Code:</strong> ${data.caretakerZip || "—"}</p>
//             <p><strong>Bio:</strong> ${data.caretakerBio || "—"}</p>
//             <p><strong>Experience:</strong> ${data.caretakerExp || "—"}</p>
//             <p><strong>Rate:</strong> $${data.caretakerRate || "—"} / hr</p>
//           </div>
//         </div>
//       </div>
//     `;
//     caretakerDisplayDiv.innerHTML = html;
//     caretakerForm.classList.add("hidden");
//     caretakerDisplaySection.classList.remove("hidden");
//   }

//   function getBase64(file) {
//     return new Promise((resolve) => {
//       if (!file) return resolve("");
//       const reader = new FileReader();
//       reader.onload = () => resolve(reader.result);
//       reader.readAsDataURL(file);
//     });
//   }

//   function previewImage(input, previewDiv, isDog) {
//     const file = input.files[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = () => {
//       previewDiv.innerHTML = `<img src="${reader.result}" class="${isDog ? 'dog' : ''}" alt="Preview">`;
//     };
//     reader.readAsDataURL(file);
//   }
// });
