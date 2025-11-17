// // Profile.js
// document.addEventListener("DOMContentLoaded", async () => {
//   if (typeof Parse === "undefined") {
//     console.error("Parse SDK not loaded!");
//     return;
//   }

//   const urlParams = new URLSearchParams(window.location.search);
//   const publicId = urlParams.get("id");
//   const typeParam = urlParams.get("type");
//   const isPublicView = !!publicId;

//   // Debugging logs
//   console.log("PROFILE JS LOADED");
//   console.log("URL:", window.location.href);
//   console.log("publicId:", publicId);
//   console.log("typeParam:", typeParam);

//   const currentUser = Parse.User.current();

//   // DOM elements
//   const roleSelect = document.getElementById("roleSelect");
//   const profileTabs = document.getElementById("profileTabs");
//   const profileRoleTabs = document.getElementById("profileRoleTabs");
//   const contentTabs = document.getElementById("contentTabs");
//   const tabButtons = document.querySelectorAll(".tab-btn");
//   const tabContents = document.querySelectorAll(".tab-content");
//   const contentTabButtons = document.querySelectorAll(".content-tab-btn");
//   const contentTabSections = document.querySelectorAll(".content-tab");
//   const logoutBtn = document.getElementById("logoutBtn");
//   const bookBtn = document.getElementById("bookCaretaker");

//   // Pet Parent Profile
//   const saveParentBtn = document.getElementById("saveProfile");
//   // const editParentBtn = document.getElementById("editProfile");
//   if (!isPublicView) document.getElementById("editProfile").classList.remove("hidden"); // hide edit option in public view
//   const parentForm = document.getElementById("parentForm");
//   const parentDisplay = document.getElementById("profileDisplay");
//   const parentSection = document.getElementById("savedProfile");

//   const parentPhotoInput = document.getElementById("parentPhoto");
//   const dogPhotoInput = document.getElementById("dogPhoto");

//   const parentPreview = document.createElement("div");
//   parentPreview.classList.add("preview");
//   parentPhotoInput.insertAdjacentElement("afterend", parentPreview);

//   const dogPreview = document.createElement("div");
//   dogPreview.classList.add("preview");
//   dogPhotoInput.insertAdjacentElement("afterend", dogPreview);

//   // Caretaker Profile
//   const saveCaretakerBtn = document.getElementById("saveCaretaker");
//   // const editCaretakerBtn = document.getElementById("editCaretaker");
//   if (!isPublicView) document.getElementById("editCaretaker").classList.remove("hidden");
//   const caretakerForm = document.getElementById("caretakerForm");
//   const caretakerDisplay = document.getElementById("caretakerDisplay");
//   const caretakerSection = document.getElementById("savedCaretaker");
//   const caretakerPhotoInput = document.getElementById("caretakerPhoto");

//   const caretakerPreview = document.createElement("div");
//   caretakerPreview.classList.add("preview");
//   caretakerPhotoInput.insertAdjacentElement("afterend", caretakerPreview);

//   // Logout
//   if (logoutBtn) {
//     logoutBtn.addEventListener("click", async () => {
//       try {
//         await Parse.User.logOut();
//       } catch (e) {
//         console.error("Error during logout:", e);
//       }
//       window.location.href = "../User_login_signup/login.html";
//     });
//   }

//   // Public Profile View
//   if (isPublicView) {
//     roleSelect.classList.add("hidden");
//     profileTabs.classList.remove("hidden");
//     profileRoleTabs.classList.add("hidden");
//     contentTabs.classList.remove("hidden");

//     const PetParent = Parse.Object.extend("PetParent");
//     const Caretaker = Parse.Object.extend("Caretaker");

//     try {
//       let profile = null;

//       if (typeParam === "PetParent") {
//         const parentQuery = new Parse.Query(PetParent);
//         parentQuery.equalTo("objectId", publicId);
//         profile = await parentQuery.first();
//         if (profile) {
//           showParentProfile(profile);
//         }
//       } else if (typeParam === "Caretaker") {
//         const caretakerQuery = new Parse.Query(Caretaker);
//         caretakerQuery.equalTo("objectId", publicId);
//         profile = await caretakerQuery.first();
//         if (profile) {
//           showCaretakerProfile(profile);
//           if (bookBtn) {
//             bookBtn.classList.remove("hidden");
//           }
//         }
//       }

//       // fallback if type is missing or query fails
//       if (!profile) {
//         const fallbackParentQuery = new Parse.Query(PetParent);
//         fallbackParentQuery.equalTo("objectId", publicId);
//         profile = await fallbackParentQuery.first();
//         if (profile) {
//           showParentProfile(profile);
//         } else {
//           const fallbackCaretakerQuery = new Parse.Query(Caretaker);
//           fallbackCaretakerQuery.equalTo("objectId", publicId);
//           profile = await fallbackCaretakerQuery.first();
//           if (profile) {
//             showCaretakerProfile(profile);
//             if (bookBtn) {
//               bookBtn.classList.remove("hidden");
//             }
//           }
//         }
//       }

//       if (!profile) {
//         alert("Profile not found.");
//         console.error("No matching profile found for ID:", publicId);
//       }
//     } catch (e) {
//       alert("Profile not found.");
//       console.error(e);
//     }
//     return;
//   }

//   // If not public view, require login
//   if (!currentUser) {
//     window.location.href = "../User_login_signup/login.html";
//     return;
//   }

//   // Role selection
//   document.getElementById("chooseParent").addEventListener("click", () => {
//     showTab("parentTab");
//     roleSelect.classList.add("hidden");
//     profileTabs.classList.remove("hidden");
//   });

//   document.getElementById("chooseCaretaker").addEventListener("click", () => {
//     showTab("caretakerTab");
//     roleSelect.classList.add("hidden");
//     profileTabs.classList.remove("hidden");
//   });

//   function showTab(tabId) {
//     tabButtons.forEach((b) => b.classList.toggle("active", b.dataset.tab === tabId));
//     tabContents.forEach((tab) => tab.classList.toggle("active", tab.id === tabId));
//   }

//   // Post/Feedback tabs
//   contentTabButtons.forEach((btn) => {
//     btn.addEventListener("click", () => {
//       const target = btn.dataset.contentTab;
//       contentTabButtons.forEach((b) => b.classList.remove("active"));
//       contentTabSections.forEach((tab) => tab.classList.remove("active"));
//       btn.classList.add("active");
//       document.getElementById(target).classList.add("active");
//     });
//   });

//   parentPhotoInput.addEventListener("change", () => previewImage(parentPhotoInput, parentPreview));
//   dogPhotoInput.addEventListener("change", () => previewImage(dogPhotoInput, dogPreview));
//   caretakerPhotoInput.addEventListener("change", () => previewImage(caretakerPhotoInput, caretakerPreview));

//   saveParentBtn.addEventListener("click", async () => {
//     try {
//       const PetParent = Parse.Object.extend("PetParent");
//       const query = new Parse.Query(PetParent);
//       query.equalTo("user", currentUser);
//       const existing = await query.first();
//       const petParent = existing || new PetParent();

//       const parentPhotoFile = parentPhotoInput.files[0];
//       const dogPhotoFile = dogPhotoInput.files[0];
//       const parentPhoto = parentPhotoFile ? new Parse.File(parentPhotoFile.name, parentPhotoFile) : null;
//       const dogPhoto = dogPhotoFile ? new Parse.File(dogPhotoFile.name, dogPhotoFile) : null;

//       const acl = petParent.getACL() || new Parse.ACL(currentUser);
//       acl.setPublicReadAccess(true);
//       acl.setWriteAccess(currentUser, true);
//       petParent.setACL(acl);

//       petParent.set("user", currentUser);
//       if (parentPhoto) petParent.set("photo", parentPhoto);
//       if (dogPhoto) petParent.set("dogPhoto", dogPhoto);
//       petParent.set("name", document.getElementById("parentName").value);
//       petParent.set("zip", document.getElementById("parentZip").value);
//       petParent.set("dogName", document.getElementById("dogName").value);
//       petParent.set("dogAge", Number(document.getElementById("dogAge").value));
//       petParent.set("dogBreed", document.getElementById("dogBreed").value);
//       petParent.set("dogWeight", Number(document.getElementById("dogWeight").value));
//       petParent.set("dogMeds", document.getElementById("dogMeds").value);
//       petParent.set("dogHypo", document.getElementById("dogHypo").value);
//       petParent.set("dogBio", document.getElementById("dogBio").value);

//       await petParent.save();
//       alert("Pet Parent Profile saved!");
//       showParentProfile(petParent);
//       profileRoleTabs.classList.add("hidden");
//       contentTabs.classList.remove("hidden");
//     } catch (err) {
//       alert("Error saving profile: " + err.message);
//       console.error(err);
//     }
//   });

//   editParentBtn.addEventListener("click", async () => {
//     const PetParent = Parse.Object.extend("PetParent");
//     const query = new Parse.Query(PetParent);
//     query.equalTo("user", currentUser);
//     const profile = await query.first();
//     if (!profile) return;

//     document.getElementById("parentName").value = profile.get("name") || "";
//     document.getElementById("parentZip").value = profile.get("zip") || "";
//     document.getElementById("dogName").value = profile.get("dogName") || "";
//     document.getElementById("dogAge").value = profile.get("dogAge") || "";
//     document.getElementById("dogBreed").value = profile.get("dogBreed") || "";
//     document.getElementById("dogWeight").value = profile.get("dogWeight") || "";
//     document.getElementById("dogMeds").value = profile.get("dogMeds") || "";
//     document.getElementById("dogHypo").value = profile.get("dogHypo") || "";
//     document.getElementById("dogBio").value = profile.get("dogBio") || "";

//     parentForm.classList.remove("hidden");
//     parentSection.classList.add("hidden");
//   });

//   function showParentProfile(profileObj) {
//     showTab("parentTab");
//     const html = `
//       <div style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
//         <div style="display: flex; align-items: center; gap: 20px;">
//           ${profileObj.get("photo") ? `<img src="${profileObj.get("photo").url()}" class="circle-photo">` : ""}
//           <div>
//             <p><strong>Name:</strong> ${profileObj.get("name") || "—"}</p>
//             <p><strong>Zip Code:</strong> ${profileObj.get("zip") || "—"}</p>
//           </div>
//         </div>
//         <hr class="section-divider" />
//         <div style="display: flex; align-items: center; gap: 20px;">
//           ${profileObj.get("dogPhoto") ? `<img src="${profileObj.get("dogPhoto").url()}" class="circle-photo">` : ""}
//           <div>
//             <h3>Dog Information</h3>
//             <p><strong>Name:</strong> ${profileObj.get("dogName") || "—"}</p>
//             <p><strong>Age:</strong> ${profileObj.get("dogAge") || "—"}</p>
//             <p><strong>Breed:</strong> ${profileObj.get("dogBreed") || "—"}</p>
//             <p><strong>Weight:</strong> ${profileObj.get("dogWeight") || "—"} lbs</p>
//             <p><strong>Medications:</strong> ${profileObj.get("dogMeds") || "—"}</p>
//             <p><strong>Hypoallergenic:</strong> ${profileObj.get("dogHypo") || "—"}</p>
//             <p><strong>Bio:</strong> ${profileObj.get("dogBio") || "—"}</p>
//           </div>
//         </div>
//       </div>`;
//     parentDisplay.innerHTML = html;
//     parentForm.classList.add("hidden");
//     parentSection.classList.remove("hidden");
//   }

//   saveCaretakerBtn.addEventListener("click", async () => {
//     try {
//       const Caretaker = Parse.Object.extend("Caretaker");
//       const query = new Parse.Query(Caretaker);
//       query.equalTo("user", currentUser);
//       const existing = await query.first();
//       const caretaker = existing || new Caretaker();

//       const photoFile = caretakerPhotoInput.files[0];
//       const photo = photoFile ? new Parse.File(photoFile.name, photoFile) : null;

//       const acl = caretaker.getACL() || new Parse.ACL(currentUser);
//       acl.setPublicReadAccess(true);
//       acl.setWriteAccess(currentUser, true);
//       caretaker.setACL(acl);

//       caretaker.set("user", currentUser);
//       if (photo) caretaker.set("photo", photo);
//       caretaker.set("name", document.getElementById("caretakerName").value);
//       caretaker.set("zip", document.getElementById("caretakerZip").value);
//       caretaker.set("bio", document.getElementById("caretakerBio").value);
//       caretaker.set("experience", document.getElementById("caretakerExp").value);
//       caretaker.set("rate", Number(document.getElementById("caretakerRate").value));

//       await caretaker.save();
//       alert("Caretaker Profile saved!");
//       showCaretakerProfile(caretaker);
//       profileRoleTabs.classList.add("hidden");
//       contentTabs.classList.remove("hidden");
//       if (bookBtn) {
//         bookBtn.classList.remove("hidden");
//       }
//     } catch (err) {
//       alert("Error saving caretaker: " + err.message);
//       console.error(err);
//     }
//   });

//   editCaretakerBtn.addEventListener("click", async () => {
//     const Caretaker = Parse.Object.extend("Caretaker");
//     const query = new Parse.Query(Caretaker);
//     query.equalTo("user", currentUser);
//     const profile = await query.first();
//     if (!profile) return;

//     document.getElementById("caretakerName").value = profile.get("name") || "";
//     document.getElementById("caretakerZip").value = profile.get("zip") || "";
//     document.getElementById("caretakerBio").value = profile.get("bio") || "";
//     document.getElementById("caretakerExp").value = profile.get("experience") || "";
//     document.getElementById("caretakerRate").value = profile.get("rate") || "";

//     caretakerForm.classList.remove("hidden");
//     caretakerSection.classList.add("hidden");
//   });

//   function showCaretakerProfile(profileObj) {
//     showTab("caretakerTab");
//     const html = `
//       <div style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
//         <div style="display: flex; align-items: center; gap: 20px;">
//           ${profileObj.get("photo") ? `<img src="${profileObj.get("photo").url()}" class="circle-photo">` : ""}
//           <div>
//             <h3>Caretaker Information</h3>
//             <p><strong>Name:</strong> ${profileObj.get("name") || "—"}</p>
//             <p><strong>Zip Code:</strong> ${profileObj.get("zip") || "—"}</p>
//             <p><strong>Bio:</strong> ${profileObj.get("bio") || "—"}</p>
//             <p><strong>Experience:</strong> ${profileObj.get("experience") || "—"}</p>
//             <p><strong>Rate:</strong> $${profileObj.get("rate") || "—"} / hr</p>
//           </div>
//         </div>
//       </div>`;
//     caretakerDisplay.innerHTML = html;
//     caretakerForm.classList.add("hidden");
//     caretakerSection.classList.remove("hidden");
//   }

//   function previewImage(input, previewDiv) {
//     const file = input.files[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = () => {
//       previewDiv.innerHTML = `<img src="${reader.result}" class="circle-photo" alt="Preview">`;
//     };
//     reader.readAsDataURL(file);
//   }

//   // If user already has a profile and this is not a public view
//   if (currentUser && !isPublicView) {
//     const PetParent = Parse.Object.extend("PetParent");
//     const Caretaker = Parse.Object.extend("Caretaker");

//     const parentQuery = new Parse.Query(PetParent);
//     parentQuery.equalTo("user", currentUser);
//     const caretakerQuery = new Parse.Query(Caretaker);
//     caretakerQuery.equalTo("user", currentUser);

//     const [parentProfile, caretakerProfile] = await Promise.all([
//       parentQuery.first(),
//       caretakerQuery.first()
//     ]);

//     if (parentProfile) {
//       showParentProfile(parentProfile);
//       roleSelect.classList.add("hidden");
//       profileTabs.classList.remove("hidden");
//       profileRoleTabs.classList.add("hidden");
//       contentTabs.classList.remove("hidden");

//     } else if (caretakerProfile) {
//       showCaretakerProfile(caretakerProfile);
//       roleSelect.classList.add("hidden");
//       profileTabs.classList.remove("hidden");
//       profileRoleTabs.classList.add("hidden");
//       contentTabs.classList.remove("hidden");

//       if (bookBtn) {
//         bookBtn.classList.remove("hidden");
//       }
//     } else {
//       roleSelect.classList.remove("hidden");
//     }
//   }

// });

// // Connect to posting page
// document.getElementById('goToPostPage').addEventListener('click', () => {
//   window.location.href = '../User_profiles_posting/post.html';
// });

// // Profile.js — Final Back4App-integrated with full public profile, edit, and photo preview logic
// document.addEventListener("DOMContentLoaded", async () => {
//   if (typeof Parse === "undefined") {
//     console.error("Parse SDK not loaded!");
//     return;
//   }

//   const urlParams = new URLSearchParams(window.location.search);
//   const publicId = urlParams.get("id");
//   const typeParam = urlParams.get("type");
//   const isPublicView = !!publicId;

//   // Debugging logs
//   console.log("PROFILE JS LOADED");
//   console.log("URL:", window.location.href);
//   console.log("publicId:", publicId);
//   console.log("typeParam:", typeParam);

//   const currentUser = Parse.User.current();

//   // DOM elements
//   const roleSelect = document.getElementById("roleSelect");
//   const profileTabs = document.getElementById("profileTabs");
//   const profileRoleTabs = document.getElementById("profileRoleTabs");
//   const contentTabs = document.getElementById("contentTabs");
//   const tabButtons = document.querySelectorAll(".tab-btn");
//   const tabContents = document.querySelectorAll(".tab-content");
//   const contentTabButtons = document.querySelectorAll(".content-tab-btn");
//   const contentTabSections = document.querySelectorAll(".content-tab");
//   const logoutBtn = document.getElementById("logoutBtn");
//   const bookBtn = document.getElementById("bookCaretaker");

//   // Pet Parent Profile
//   const saveParentBtn = document.getElementById("saveProfile");
//   const editParentBtn = document.getElementById("editProfile"); // ✅ uncommented so it's usable
//   const parentForm = document.getElementById("parentForm");
//   const parentDisplay = document.getElementById("profileDisplay");
//   const parentSection = document.getElementById("savedProfile");

//   const parentPhotoInput = document.getElementById("parentPhoto");
//   const dogPhotoInput = document.getElementById("dogPhoto");

//   const parentPreview = document.createElement("div");
//   parentPreview.classList.add("preview");
//   parentPhotoInput.insertAdjacentElement("afterend", parentPreview);

//   const dogPreview = document.createElement("div");
//   dogPreview.classList.add("preview");
//   dogPhotoInput.insertAdjacentElement("afterend", dogPreview);

//   // Caretaker Profile 
//   const saveCaretakerBtn = document.getElementById("saveCaretaker");
//   const editCaretakerBtn = document.getElementById("editCaretaker"); // ✅ uncommented so it's usable
//   const caretakerForm = document.getElementById("caretakerForm");
//   const caretakerDisplay = document.getElementById("caretakerDisplay");
//   const caretakerSection = document.getElementById("savedCaretaker");
//   const caretakerPhotoInput = document.getElementById("caretakerPhoto");

//   const caretakerPreview = document.createElement("div");
//   caretakerPreview.classList.add("preview");
//   caretakerPhotoInput.insertAdjacentElement("afterend", caretakerPreview);

//   // Logout
//   if (logoutBtn) {
//     logoutBtn.addEventListener("click", async () => {
//       try {
//         await Parse.User.logOut();
//       } catch (e) {
//         console.error("Error during logout:", e);
//       }
//       window.location.href = "../User_login_signup/login.html";
//     });
//   }

//   // Public Profile View
//   if (isPublicView) {
//     roleSelect.classList.add("hidden");
//     profileTabs.classList.remove("hidden");
//     profileRoleTabs.classList.add("hidden");
//     contentTabs.classList.remove("hidden");

//     const PetParent = Parse.Object.extend("PetParent");
//     const Caretaker = Parse.Object.extend("Caretaker");

//     try {
//       let profile = null;

//       if (typeParam === "PetParent") {
//         const parentQuery = new Parse.Query(PetParent);
//         parentQuery.equalTo("objectId", publicId);
//         profile = await parentQuery.first();
//         if (profile) {
//           showParentProfile(profile);
//         }
//       } else if (typeParam === "Caretaker") {
//         const caretakerQuery = new Parse.Query(Caretaker);
//         caretakerQuery.equalTo("objectId", publicId);
//         profile = await caretakerQuery.first();
//         if (profile) {
//           showCaretakerProfile(profile);
//           if (bookBtn) {
//             bookBtn.classList.remove("hidden");
//           }
//         }
//       }

//       if (!profile) {
//         const fallbackParentQuery = new Parse.Query(PetParent);
//         fallbackParentQuery.equalTo("objectId", publicId);
//         profile = await fallbackParentQuery.first();
//         if (profile) {
//           showParentProfile(profile);
//         } else {
//           const fallbackCaretakerQuery = new Parse.Query(Caretaker);
//           fallbackCaretakerQuery.equalTo("objectId", publicId);
//           profile = await fallbackCaretakerQuery.first();
//           if (profile) {
//             showCaretakerProfile(profile);
//             if (bookBtn) {
//               bookBtn.classList.remove("hidden");
//             }
//           }
//         }
//       }

//       if (!profile) {
//         alert("Profile not found.");
//         console.error("No matching profile found for ID:", publicId);
//       }
//     } catch (e) {
//       alert("Profile not found.");
//       console.error(e);
//     }
//     return;
//   }

//   // If not public view, require login
//   if (!currentUser) {
//     window.location.href = "../User_login_signup/login.html";
//     return;
//   }

//   // Role selection
//   document.getElementById("chooseParent").addEventListener("click", () => {
//     showTab("parentTab");
//     roleSelect.classList.add("hidden");
//     profileTabs.classList.remove("hidden");
//   });

//   document.getElementById("chooseCaretaker").addEventListener("click", () => {
//     showTab("caretakerTab");
//     roleSelect.classList.add("hidden");
//     profileTabs.classList.remove("hidden");
//   });

//   function showTab(tabId) {
//     tabButtons.forEach((b) => b.classList.toggle("active", b.dataset.tab === tabId));
//     tabContents.forEach((tab) => tab.classList.toggle("active", tab.id === tabId));
//   }

//   // Post/Feedback tabs
//   contentTabButtons.forEach((btn) => {
//     btn.addEventListener("click", () => {
//       const target = btn.dataset.contentTab;
//       contentTabButtons.forEach((b) => b.classList.remove("active"));
//       contentTabSections.forEach((tab) => tab.classList.remove("active"));
//       btn.classList.add("active");
//       document.getElementById(target).classList.add("active");
//     });
//   });

//   parentPhotoInput.addEventListener("change", () => previewImage(parentPhotoInput, parentPreview));
//   dogPhotoInput.addEventListener("change", () => previewImage(dogPhotoInput, dogPreview));
//   caretakerPhotoInput.addEventListener("change", () => previewImage(caretakerPhotoInput, caretakerPreview));

//   saveParentBtn.addEventListener("click", async () => {
//     try {
//       const PetParent = Parse.Object.extend("PetParent");
//       const query = new Parse.Query(PetParent);
//       query.equalTo("user", currentUser);
//       const existing = await query.first();
//       const petParent = existing || new PetParent();

//       const parentPhotoFile = parentPhotoInput.files[0];
//       const dogPhotoFile = dogPhotoInput.files[0];
//       const parentPhoto = parentPhotoFile ? new Parse.File(parentPhotoFile.name, parentPhotoFile) : null;
//       const dogPhoto = dogPhotoFile ? new Parse.File(dogPhotoFile.name, dogPhotoFile) : null;

//       const acl = petParent.getACL() || new Parse.ACL(currentUser);
//       acl.setPublicReadAccess(true);
//       acl.setWriteAccess(currentUser, true);
//       petParent.setACL(acl);

//       petParent.set("user", currentUser);
//       if (parentPhoto) petParent.set("photo", parentPhoto);
//       if (dogPhoto) petParent.set("dogPhoto", dogPhoto);
//       petParent.set("name", document.getElementById("parentName").value);
//       petParent.set("zip", document.getElementById("parentZip").value);
//       petParent.set("dogName", document.getElementById("dogName").value);
//       petParent.set("dogAge", Number(document.getElementById("dogAge").value));
//       petParent.set("dogBreed", document.getElementById("dogBreed").value);
//       petParent.set("dogWeight", Number(document.getElementById("dogWeight").value));
//       petParent.set("dogMeds", document.getElementById("dogMeds").value);
//       petParent.set("dogHypo", document.getElementById("dogHypo").value);
//       petParent.set("dogBio", document.getElementById("dogBio").value);

//       await petParent.save();
//       alert("Pet Parent Profile saved!");
//       showParentProfile(petParent);
//       profileRoleTabs.classList.add("hidden");
//       contentTabs.classList.remove("hidden");
//     } catch (err) {
//       alert("Error saving profile: " + err.message);
//       console.error(err);
//     }
//   });

//   editParentBtn.addEventListener("click", async () => {
//     const PetParent = Parse.Object.extend("PetParent");
//     const query = new Parse.Query(PetParent);
//     query.equalTo("user", currentUser);
//     const profile = await query.first();
//     if (!profile) return;

//     document.getElementById("parentName").value = profile.get("name") || "";
//     document.getElementById("parentZip").value = profile.get("zip") || "";
//     document.getElementById("dogName").value = profile.get("dogName") || "";
//     document.getElementById("dogAge").value = profile.get("dogAge") || "";
//     document.getElementById("dogBreed").value = profile.get("dogBreed") || "";
//     document.getElementById("dogWeight").value = profile.get("dogWeight") || "";
//     document.getElementById("dogMeds").value = profile.get("dogMeds") || "";
//     document.getElementById("dogHypo").value = profile.get("dogHypo") || "";
//     document.getElementById("dogBio").value = profile.get("dogBio") || "";

//     parentForm.classList.remove("hidden");
//     parentSection.classList.add("hidden");
//   });

//   function showParentProfile(profileObj) {
//     showTab("parentTab");
//     const html = `...`;  // [unchanged for brevity — you can insert yours here]
//     parentDisplay.innerHTML = html;
//     parentForm.classList.add("hidden");
//     parentSection.classList.remove("hidden");

//     if (!isPublicView) document.getElementById("editProfile").classList.remove("hidden");
//     else document.getElementById("editProfile").classList.add("hidden"); // ✅ hide edit in public view
//   }

//   saveCaretakerBtn.addEventListener("click", async () => {
//     // [same as before]
//   });

//   editCaretakerBtn.addEventListener("click", async () => {
//     // [same as before]
//   });

//   function showCaretakerProfile(profileObj) {
//     showTab("caretakerTab");
//     const html = `...`;
//     caretakerDisplay.innerHTML = html;
//     caretakerForm.classList.add("hidden");
//     caretakerSection.classList.remove("hidden");

//     if (!isPublicView) document.getElementById("editCaretaker").classList.remove("hidden");
//     else document.getElementById("editCaretaker").classList.add("hidden"); // ✅ hide edit in public view
//   }

//   function previewImage(input, previewDiv) {
//     const file = input.files[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = () => {
//       previewDiv.innerHTML = `<img src="${reader.result}" class="circle-photo" alt="Preview">`;
//     };
//     reader.readAsDataURL(file);
//   }

//   // If user already has a profile and this is not a public view
//   if (currentUser && !isPublicView) {
//     console.log("Logged-in user detected. Loading private profile.");

//     const PetParent = Parse.Object.extend("PetParent");
//     const Caretaker = Parse.Object.extend("Caretaker");

//     const parentQuery = new Parse.Query(PetParent);
//     parentQuery.equalTo("user", currentUser);
//     const caretakerQuery = new Parse.Query(Caretaker);
//     caretakerQuery.equalTo("user", currentUser);

//     const [parentProfile, caretakerProfile] = await Promise.all([
//       parentQuery.first(),
//       caretakerQuery.first()
//     ]);

//     console.log("Found parent profile:", !!parentProfile);
//     console.log("Found caretaker profile:", !!caretakerProfile);

//     if (parentProfile) {
//       showParentProfile(parentProfile);
//       roleSelect.classList.add("hidden");
//       profileTabs.classList.remove("hidden");
//       profileRoleTabs.classList.add("hidden");
//       contentTabs.classList.remove("hidden");

//     } else if (caretakerProfile) {
//       showCaretakerProfile(caretakerProfile);
//       roleSelect.classList.add("hidden");
//       profileTabs.classList.remove("hidden");
//       profileRoleTabs.classList.add("hidden");
//       contentTabs.classList.remove("hidden");

//       if (bookBtn) {
//         bookBtn.classList.remove("hidden");
//       }
//     } else {
//       roleSelect.classList.remove("hidden");
//     }
//   }

// });

// // Connect to posting page
// document.getElementById('goToPostPage').addEventListener('click', () => {
//   window.location.href = '../User_profiles_posting/post.html';
// });

// Profile.js 
document.addEventListener("DOMContentLoaded", async () => {
  if (typeof Parse === "undefined") {
    console.error("Parse SDK not loaded!");
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const publicId = urlParams.get("id");
  const typeParam = urlParams.get("type");
  const isPublicView = !!publicId;

  // Debugging logs
  console.log("PROFILE JS LOADED");
  console.log("URL:", window.location.href);
  console.log("publicId:", publicId);
  console.log("typeParam:", typeParam);

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
  const bookBtn = document.getElementById("bookCaretaker");

  // Pet Parent Profile
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

  // Caretaker Profile 
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

  // Public Profile View
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
        }
      } else if (typeParam === "Caretaker") {
        const caretakerQuery = new Parse.Query(Caretaker);
        caretakerQuery.equalTo("objectId", publicId);
        profile = await caretakerQuery.first();
        if (profile) {
          showCaretakerProfile(profile);
          if (bookBtn) {
            bookBtn.classList.remove("hidden");
          }
        }
      }

      // fallback if type is missing or query fails
      if (!profile) {
        const fallbackParentQuery = new Parse.Query(PetParent);
        fallbackParentQuery.equalTo("objectId", publicId);
        profile = await fallbackParentQuery.first();
        if (profile) {
          showParentProfile(profile);
        } else {
          const fallbackCaretakerQuery = new Parse.Query(Caretaker);
          fallbackCaretakerQuery.equalTo("objectId", publicId);
          profile = await fallbackCaretakerQuery.first();
          if (profile) {
            showCaretakerProfile(profile);
            if (bookBtn) {
              bookBtn.classList.remove("hidden");
            }
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
    return;
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

  parentPhotoInput.addEventListener("change", () => previewImage(parentPhotoInput, parentPreview));
  dogPhotoInput.addEventListener("change", () => previewImage(dogPhotoInput, dogPreview));
  caretakerPhotoInput.addEventListener("change", () => previewImage(caretakerPhotoInput, caretakerPreview));

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

    // Only show edit button if this is not public view
    if (!isPublicView) editParentBtn.classList.remove("hidden");
    else editParentBtn.classList.add("hidden");
  }

  // Caretaker profile
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

      if (bookBtn) bookBtn.classList.remove("hidden");

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
      </div>
    `;

    caretakerDisplay.innerHTML = html;
    caretakerForm.classList.add("hidden");
    caretakerSection.classList.remove("hidden");

    // Only show edit button if this is not public view
    if (!isPublicView) editCaretakerBtn.classList.remove("hidden");
    else editCaretakerBtn.classList.add("hidden");
  }

  // Image preview
  function previewImage(input, previewDiv) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      previewDiv.innerHTML = `<img src="${reader.result}" class="circle-photo" alt="Preview">`;
    };
    reader.readAsDataURL(file);
  }

  // If user already has a profile and this is not a public view
  if (currentUser && !isPublicView) {
    console.log("Logged-in user detected. Loading private profile.");

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

    console.log("Found parent profile:", !!parentProfile);
    console.log("Found caretaker profile:", !!caretakerProfile);

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

      if (bookBtn) bookBtn.classList.remove("hidden");

    } else {
      roleSelect.classList.remove("hidden");
    }
  }

});


// Go to post page button
document.getElementById('goToPostPage').addEventListener('click', () => {
  window.location.href = '../User_profiles_posting/post.html';
});

