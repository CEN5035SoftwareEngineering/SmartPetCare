
// search.js

document.getElementById('searchBtn').addEventListener('click', async () => {
  const zipInput = document.getElementById('zipSearch').value.trim();
  const resultsContainer = document.getElementById('results');

  if (!zipInput) {
    resultsContainer.innerHTML = "<p>Please enter a ZIP code.</p>";
    return;
  }

  resultsContainer.innerHTML = "<p>Searching for sitters near you...</p>";

  try {
    // Step 1️⃣: Get latitude and longitude from ZIP code using Zippopotam.us
    const zipResponse = await fetch(`https://api.zippopotam.us/us/${zipInput}`);
    if (!zipResponse.ok) throw new Error("ZIP not found.");

    const zipData = await zipResponse.json();
    const place = zipData.places[0];
    const lat = parseFloat(place.latitude);
    const lng = parseFloat(place.longitude);

    // Step 2️⃣: Create a GeoPoint from the ZIP code
    const userGeoPoint = new Parse.GeoPoint(lat, lng);

    // Step 3️⃣: Query your Back4App "Caretaker" class for nearby sitters
    const Caretaker = Parse.Object.extend("Caretaker");
    const query = new Parse.Query(Caretaker);

    // Find caretakers within 10 miles (adjust as needed)
    query.withinMiles("location", userGeoPoint, 10);

    // Optionally: sort by distance (closest first)
    query.near("location", userGeoPoint);

    const results = await query.find();

    // Step 4️⃣: Display the results
    if (results.length === 0) {
      resultsContainer.innerHTML = `<p>No caretakers found within 10 miles of ZIP ${zipInput}.</p>`;
      return;
    }

    resultsContainer.innerHTML = results.map((caretaker) => {
      const name = caretaker.get("name");
      const desc = caretaker.get("description") || "No description available";
      const rate = caretaker.get("rate")
        ? `$${caretaker.get("rate")}/hr`
        : "Rate not listed";
      const zip = caretaker.get("zipCode") || "Unknown ZIP";

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
    console.error("Error:", error);
    resultsContainer.innerHTML = `<p>Could not complete search. Please check the ZIP and try again.</p>`;
  }
});



// document.getElementById('searchBtn').addEventListener('click', async () => {
//   const zipInput = document.getElementById('zipSearch').value.trim();
//   const resultsContainer = document.getElementById('results');

//   if (!zipInput) {
//     resultsContainer.innerHTML = "<p>Please enter a ZIP code.</p>";
//     return;
//   }

//   resultsContainer.innerHTML = "<p>Searching nearby caretakers...</p>";

//   try {
//     // Step 1: Convert ZIP code → latitude & longitude using Zippopotam API
//     const zipResponse = await fetch(`https://api.zippopotam.us/us/${zipInput}`);
//     if (!zipResponse.ok) throw new Error("ZIP code not found.");

//     const zipData = await zipResponse.json();
//     const place = zipData.places[0];
//     const lat = parseFloat(place.latitude);
//     const lng = parseFloat(place.longitude);

//     // Step 2: Build GeoPoint for query
//     const userGeoPoint = new Parse.GeoPoint(lat, lng);

//     // Step 3: Query caretakers within 10 miles
//     const Caretaker = Parse.Object.extend("Caretaker");
//     const query = new Parse.Query(Caretaker);
//     query.withinMiles("location", userGeoPoint, 10);

//     const results = await query.find();

//     // Step 4: Display results
//     if (results.length === 0) {
//       resultsContainer.innerHTML = `<p>No caretakers found within 10 miles of ZIP ${zipInput}.</p>`;
//       return;
//     }

//     resultsContainer.innerHTML = results.map(result => {
//       const name = result.get("name");
//       const desc = result.get("description") || "No description available";
//       const rate = result.get("rate") ? `$${result.get("rate")}/hr` : "Rate not listed";
//       const zip = result.get("zipCode") || "Unknown ZIP";

//       return `
//         <div class="result-card">
//           <h3>${name}</h3>
//           <p>${desc}</p>
//           <p><strong>${rate}</strong></p>
//           <p><small>ZIP: ${zip}</small></p>
//         </div>
//       `;
//     }).join("");

//   } catch (error) {
//     console.error("Search error:", error);
//     resultsContainer.innerHTML = `<p>Could not find results for ZIP ${zipInput}. Please try again.</p>`;
//   }
// });
