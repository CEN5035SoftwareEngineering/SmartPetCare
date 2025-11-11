// // search.js
// document.addEventListener("DOMContentLoaded", () => {
//   const searchBtn = document.getElementById("searchBtn");
//   const zipSearch = document.getElementById("zipSearch");
//   const resultsDiv = document.getElementById("results");

//   searchBtn.addEventListener("click", async () => {
//     const zipQuery = zipSearch.value.trim();
//     resultsDiv.innerHTML = "";

//     if (!zipQuery) {
//       resultsDiv.innerHTML = `<p class="no-results">Please enter a ZIP code.</p>`;
//       return;
//     }

//     try {
//       const Caretaker = Parse.Object.extend("Caretaker");
//       const query = new Parse.Query(Caretaker);
//       query.equalTo("zip", zipQuery);

//       const results = await query.find();

//       if (results.length === 0) {
//         resultsDiv.innerHTML = `<p class="no-results">No caretakers found for ZIP code ${zipQuery}.</p>`;
//         return;
//       }

//       results.forEach(c => {
//         const caretaker = c.toJSON();
//         const photoURL = caretaker.photo?.url || "https://via.placeholder.com/100";

//         const card = document.createElement("div");
//         card.classList.add("sitter-card");
//         card.innerHTML = `
//           <img src="${photoURL}" alt="${caretaker.name}">
//           <div>
//             <h3>${caretaker.name}</h3>
//             <p><strong>Experience:</strong> ${caretaker.experience || "N/A"}</p>
//             <p><strong>Rate:</strong> $${caretaker.rate || "?"}/hr</p>
//             <p><strong>ZIP:</strong> ${caretaker.zip}</p>
//             <p>${caretaker.bio || ""}</p>
//           </div>
//         `;
//         resultsDiv.appendChild(card);
//       });
//     } catch (error) {
//       console.error("Error fetching caretakers:", error);
//       resultsDiv.innerHTML = `<p class="no-results">Error loading results. Please try again later.</p>`;
//     }
//   });
// });

// search.js

document.getElementById('searchBtn').addEventListener('click', async () => {
  const zipInput = document.getElementById('zipSearch').value.trim();
  const resultsContainer = document.getElementById('results');

  if (!zipInput) {
    resultsContainer.innerHTML = "<p>Please enter a ZIP code.</p>";
    return;
  }

  resultsContainer.innerHTML = "<p>Searching nearby caretakers...</p>";

  try {
    // Step 1: Convert ZIP code → latitude & longitude using Zippopotam API
    const zipResponse = await fetch(`https://api.zippopotam.us/us/${zipInput}`);
    if (!zipResponse.ok) throw new Error("ZIP code not found.");

    const zipData = await zipResponse.json();
    const place = zipData.places[0];
    const lat = parseFloat(place.latitude);
    const lng = parseFloat(place.longitude);

    // Step 2: Build GeoPoint for query
    const userGeoPoint = new Parse.GeoPoint(lat, lng);

    // Step 3: Query caretakers within 10 miles
    const Caretaker = Parse.Object.extend("Caretaker");
    const query = new Parse.Query(Caretaker);
    query.withinMiles("location", userGeoPoint, 10);

    const results = await query.find();

    // Step 4: Display results
    if (results.length === 0) {
      resultsContainer.innerHTML = `<p>No caretakers found within 10 miles of ZIP ${zipInput}.</p>`;
      return;
    }

    resultsContainer.innerHTML = results.map(result => {
      const name = result.get("name");
      const desc = result.get("description") || "No description available";
      const rate = result.get("rate") ? `$${result.get("rate")}/hr` : "Rate not listed";
      const zip = result.get("zipCode") || "Unknown ZIP";

      return `
        <div class="result-card">
          <h3>${name}</h3>
          <p>${desc}</p>
          <p><strong>${rate}</strong></p>
          <p><small>ZIP: ${zip}</small></p>
        </div>
      `;
    }).join("");

  } catch (error) {
    console.error("Search error:", error);
    resultsContainer.innerHTML = `<p>Could not find results for ZIP ${zipInput}. Please try again.</p>`;
  }
});

