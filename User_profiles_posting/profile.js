// Profile.js — Handles saving, displaying, and showing uploaded photos

// To make profiles visible to other users (e.g., sitters browsing parent profiles):

// Move from localStorage → a shared database (like Firebase, Supabase, or a Node.js backend).

// The Profile.js script can then use fetch() or Firebase’s API to store and retrieve all profiles globally.

// Profile.js — Handles saving, displaying, and showing uploaded photos
document.addEventListener("DOMContentLoaded", () => {
  // Pet Parent section
  const saveBtn = document.getElementById("saveProfile");
  const editBtn = document.getElementById("editProfile");
  const form = document.getElementById("parentForm");
  const displaySection = document.getElementById("savedProfile");
  const displayDiv = document.getElementById("profileDisplay");

  const parentPhotoInput = document.getElementById("parentPhoto");
  const dogPhotoInput = document.getElementById("dogPhoto");

  // Add preview containers
  const parentPreview = document.createElement("div");
  parentPreview.classList.add("preview");
  parentPhotoInput.insertAdjacentElement("afterend", parentPreview);

  const dogPreview = document.createElement("div");
  dogPreview.classList.add("preview");
  dogPhotoInput.insertAdjacentElement("afterend", dogPreview);

  // Live preview when selecting new image
  parentPhotoInput.addEventListener("change", () => previewImage(parentPhotoInput, parentPreview, false));
  dogPhotoInput.addEventListener("change", () => previewImage(dogPhotoInput, dogPreview, true));

  // Load profile if saved
  const existingData = localStorage.getItem("petParentProfile");
  if (existingData) showParentProfile(JSON.parse(existingData));

  // Save profile
  saveBtn.addEventListener("click", async () => {
    const parentPhotoData = await getBase64(parentPhotoInput.files[0]);
    const dogPhotoData = await getBase64(dogPhotoInput.files[0]);

    const parentProfile = {
      parentName: document.getElementById("parentName").value,
      parentZip: document.getElementById("parentZip").value,
      parentPhoto: parentPhotoData || "",
      dogName: document.getElementById("dogName").value,
      dogAge: document.getElementById("dogAge").value,
      dogBreed: document.getElementById("dogBreed").value,
      dogWeight: document.getElementById("dogWeight").value,
      dogMeds: document.getElementById("dogMeds").value,
      dogHypo: document.getElementById("dogHypo").value,
      dogBio: document.getElementById("dogBio").value,
      dogPhoto: dogPhotoData || ""
    };

    localStorage.setItem("petParentProfile", JSON.stringify(parentProfile));
    showParentProfile(parentProfile);
  });

  // Edit profile
  editBtn.addEventListener("click", () => {
    const savedData = JSON.parse(localStorage.getItem("petParentProfile"));
    if (savedData) {
      document.getElementById("parentName").value = savedData.parentName;
      document.getElementById("parentZip").value = savedData.parentZip;
      document.getElementById("dogName").value = savedData.dogName;
      document.getElementById("dogAge").value = savedData.dogAge;
      document.getElementById("dogBreed").value = savedData.dogBreed;
      document.getElementById("dogWeight").value = savedData.dogWeight;
      document.getElementById("dogMeds").value = savedData.dogMeds;
      document.getElementById("dogHypo").value = savedData.dogHypo;
      document.getElementById("dogBio").value = savedData.dogBio;
    }
    form.classList.remove("hidden");
    displaySection.classList.add("hidden");
  });

  // Caretaker section
  const saveCaretakerBtn = document.getElementById("saveCaretaker");
  const editCaretakerBtn = document.getElementById("editCaretaker");
  const caretakerForm = document.getElementById("caretakerForm");
  const caretakerDisplaySection = document.getElementById("savedCaretaker");
  const caretakerDisplayDiv = document.getElementById("caretakerDisplay");
  const caretakerPhotoInput = document.getElementById("caretakerPhoto");

  // Add caretaker preview container
  const caretakerPreview = document.createElement("div");
  caretakerPreview.classList.add("preview");
  caretakerPhotoInput.insertAdjacentElement("afterend", caretakerPreview);

  caretakerPhotoInput.addEventListener("change", () => previewImage(caretakerPhotoInput, caretakerPreview, false));

  // Load caretaker profile if saved
  const existingCaretakerData = localStorage.getItem("caretakerProfile");
  if (existingCaretakerData) showCaretakerProfile(JSON.parse(existingCaretakerData));

  // Save caretaker profile
  saveCaretakerBtn.addEventListener("click", async () => {
    const caretakerPhotoData = await getBase64(caretakerPhotoInput.files[0]);

    const caretakerProfile = {
      caretakerName: document.getElementById("caretakerName").value,
      caretakerZip: document.getElementById("caretakerZip").value,
      caretakerBio: document.getElementById("caretakerBio").value,
      caretakerExp: document.getElementById("caretakerExp").value,
      caretakerRate: document.getElementById("caretakerRate").value,
      caretakerPhoto: caretakerPhotoData || ""
    };

    localStorage.setItem("caretakerProfile", JSON.stringify(caretakerProfile));
    showCaretakerProfile(caretakerProfile);
  });

  // Edit caretaker profile
  editCaretakerBtn.addEventListener("click", () => {
    const savedData = JSON.parse(localStorage.getItem("caretakerProfile"));
    if (savedData) {
      document.getElementById("caretakerName").value = savedData.caretakerName;
      document.getElementById("caretakerZip").value = savedData.caretakerZip;
      document.getElementById("caretakerBio").value = savedData.caretakerBio;
      document.getElementById("caretakerExp").value = savedData.caretakerExp;
      document.getElementById("caretakerRate").value = savedData.caretakerRate;
    }
    caretakerForm.classList.remove("hidden");
    caretakerDisplaySection.classList.add("hidden");
  });

  // Convert image file to Base64
  function getBase64(file) {
    return new Promise((resolve) => {
      if (!file) return resolve("");
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  }

  // Preview image before saving
  function previewImage(input, previewDiv, isDog) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      previewDiv.innerHTML = `<img src="${reader.result}" class="${isDog ? 'dog' : ''}" alt="Preview">`;
    };
    reader.readAsDataURL(file);
  }

  // Display saved pet parent profile
  function showParentProfile(data) {
    let html = `
      <div style="display:flex; align-items:center; flex-wrap:wrap;">
        ${data.parentPhoto ? `<div><img src="${data.parentPhoto}" alt="Parent Photo"></div>` : ""}
        ${data.dogPhoto ? `<div><img src="${data.dogPhoto}" class="dog-photo" alt="Dog Photo"></div>` : ""}
      </div>

      <p><strong>Name:</strong> ${data.parentName || "—"}</p>
      <p><strong>Zip Code:</strong> ${data.parentZip || "—"}</p>
      <h3>Dog Information</h3>
      <p><strong>Name:</strong> ${data.dogName || "—"}</p>
      <p><strong>Age:</strong> ${data.dogAge || "—"}</p>
      <p><strong>Breed:</strong> ${data.dogBreed || "—"}</p>
      <p><strong>Weight:</strong> ${data.dogWeight || "—"} lbs</p>
      <p><strong>Medications:</strong> ${data.dogMeds || "—"}</p>
      <p><strong>Hypoallergenic:</strong> ${data.dogHypo || "—"}</p>
      <p><strong>Bio:</strong> ${data.dogBio || "—"}</p>
    `;

    displayDiv.innerHTML = html;
    form.classList.add("hidden");
    displaySection.classList.remove("hidden");
  }

  // Display saved caretaker profile
  function showCaretakerProfile(data) {
    let html = `
      <div style="display:flex; align-items:center; flex-wrap:wrap;">
        ${data.caretakerPhoto ? `<div><img src="${data.caretakerPhoto}" alt="Caretaker Photo"></div>` : ""}
      </div>

      <p><strong>Name:</strong> ${data.caretakerName || "—"}</p>
      <p><strong>Zip Code:</strong> ${data.caretakerZip || "—"}</p>
      <p><strong>Bio:</strong> ${data.caretakerBio || "—"}</p>
      <p><strong>Experience:</strong> ${data.caretakerExp || "—"}</p>
      <p><strong>Rate:</strong> $${data.caretakerRate || "—"} / hr</p>
    `;

    caretakerDisplayDiv.innerHTML = html;
    caretakerForm.classList.add("hidden");
    caretakerDisplaySection.classList.remove("hidden");
  }
});