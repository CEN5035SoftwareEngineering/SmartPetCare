// // Initialize Parse
// Parse.initialize("fefJHvdGDQOAtrHXUOVnX62hq3s2KB8gUViNUWWP", "klHYFmiUyu9MhG0kVa4U5zjuyVyMD0oWpo33gHfb");
// Parse.serverURL = "https://parseapi.back4app.com/";

// document.addEventListener("DOMContentLoaded", () => {
//   const searchInput = document.getElementById("zipcode");
//   const searchBtn = document.getElementById("searchBtn");
//   const resultsDiv = document.getElementById("results");

//   const currentUser = Parse.User.current();
//   if (!currentUser) {
//     alert("You must be logged in to use this page.");
//     window.location.href = "../User_login_signup/login.html";
//     return;
//   }

//   async function searchByZip() {
//     const zip = searchInput.value.trim();
//     resultsDiv.innerHTML = "";

//     if (!zip || !/^\d{5}$/.test(zip)) {
//       resultsDiv.innerHTML = "<p>Please enter a valid 5-digit ZIP code.</p>";
//       return;
//     }

//     try {
//       const results = await Parse.Cloud.run("searchByZip", { zip });

//       if (!results || results.length === 0) {
//         resultsDiv.innerHTML = "<p>No users found for that ZIP code.</p>";
//         return;
//       }

//       results.forEach(profile => {
//         const user = profile.get("user");
//         const username = user?.get("username") || "Unknown";
//         // const type = profile.className;
//         const type = profile.className === "Caretaker" ? "Caretaker" : "PetParent";
//         const name = profile.get("name") || "";
//         const zipCode = profile.get("zip") || "";
//         const profileId = profile.id;
//         const profileLink = `../User_profiles_posting/profile.html?id=${profileId}`;

//         const card = document.createElement("div");
//         card.classList.add("user-card");

//         let html = `
//           <a href="${profileLink}" target="_blank"><strong>${username}</strong></a><br>
//           ${name}<br>
//           ${type}<br>
//           ${zipCode}<br>
//         `;

//         if (type === "Caretaker") {
//           const rate = profile.get("rate");
//           const experience = profile.get("experience") || "Not listed";

//           html += `
//             $${rate !== undefined ? Number(rate).toFixed(2) : "N/A"} / hr<br>
//             Experience: ${experience}<br>
//           `;
//         }

//         card.innerHTML = html;
//         resultsDiv.appendChild(card);
//       });

//     } catch (err) {
//       console.error("Search error:", err);
//       resultsDiv.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
//     }
//   }

//   searchBtn.addEventListener("click", searchByZip);
//   searchInput.addEventListener("keyup", (e) => {
//     if (e.key === "Enter") {
//       searchByZip();
//     }
//   });
// });

// Initialize Parse
Parse.initialize("fefJHvdGDQOAtrHXUOVnX62hq3s2KB8gUViNUWWP", "klHYFmiUyu9MhG0kVa4U5zjuyVyMD0oWpo33gHfb");
Parse.serverURL = "https://parseapi.back4app.com/";

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("zipcode");
  const searchBtn = document.getElementById("searchBtn");
  const resultsDiv = document.getElementById("results");

  const currentUser = Parse.User.current();
  if (!currentUser) {
    alert("You must be logged in to use this page.");
    window.location.href = "../User_login_signup/login.html";
    return;
  }

  async function searchByZip() {
    const zip = searchInput.value.trim();
    resultsDiv.innerHTML = "";

    if (!zip || !/^\d{5}$/.test(zip)) {
      resultsDiv.innerHTML = "<p>Please enter a valid 5-digit ZIP code.</p>";
      return;
    }

    try {
      const results = await Parse.Cloud.run("searchByZip", { zip });

      if (!results || results.length === 0) {
        resultsDiv.innerHTML = "<p>No users found for that ZIP code.</p>";
        return;
      }

      results.forEach(profile => {
        const user = profile.get("user");
        const username = user?.get("username") || "Unknown";
        // const type = profile.className;
        const type = profile.className === "Caretaker" ? "Caretaker" : "PetParent";
        const name = profile.get("name") || "";
        const zipCode = profile.get("zip") || "";
        const profileId = profile.id;
        const profileLink = `../User_profiles_posting/profile.html?id=${profileId}&type=${type}`;

        const card = document.createElement("div");
        card.classList.add("user-card");

        let html = `
          <a href="${profileLink}" target="_blank"><strong>${username}</strong></a><br>
          ${name}<br>
          ${type}<br>
          ${zipCode}<br>
        `;

        if (type === "Caretaker") {
          const rate = profile.get("rate");
          const experience = profile.get("experience") || "Not listed";

          html += `
            $${rate !== undefined ? Number(rate).toFixed(2) : "N/A"} / hr<br>
            Experience: ${experience}<br>
          `;
        }

        card.innerHTML = html;
        resultsDiv.appendChild(card);
      });

    } catch (err) {
      console.error("Search error:", err);
      resultsDiv.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
    }
  }

  searchBtn.addEventListener("click", searchByZip);
  searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      searchByZip();
    }
  });
});
