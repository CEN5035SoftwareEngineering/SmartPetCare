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

