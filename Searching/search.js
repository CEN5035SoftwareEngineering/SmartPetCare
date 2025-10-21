// search.js
document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("searchBtn");
  const zipSearch = document.getElementById("zipSearch");
  const resultsDiv = document.getElementById("results");

  searchBtn.addEventListener("click", async () => {
    const zipQuery = zipSearch.value.trim();
    resultsDiv.innerHTML = "";

    if (!zipQuery) {
      resultsDiv.innerHTML = `<p class="no-results">Please enter a ZIP code.</p>`;
      return;
    }

    try {
      const Caretaker = Parse.Object.extend("Caretaker");
      const query = new Parse.Query(Caretaker);
      query.equalTo("zip", zipQuery);

      const results = await query.find();

      if (results.length === 0) {
        resultsDiv.innerHTML = `<p class="no-results">No caretakers found for ZIP code ${zipQuery}.</p>`;
        return;
      }

      results.forEach(c => {
        const caretaker = c.toJSON();
        const photoURL = caretaker.photo?.url || "https://via.placeholder.com/100";

        const card = document.createElement("div");
        card.classList.add("sitter-card");
        card.innerHTML = `
          <img src="${photoURL}" alt="${caretaker.name}">
          <div>
            <h3>${caretaker.name}</h3>
            <p><strong>Experience:</strong> ${caretaker.experience || "N/A"}</p>
            <p><strong>Rate:</strong> $${caretaker.rate || "?"}/hr</p>
            <p><strong>ZIP:</strong> ${caretaker.zip}</p>
            <p>${caretaker.bio || ""}</p>
          </div>
        `;
        resultsDiv.appendChild(card);
      });
    } catch (error) {
      console.error("Error fetching caretakers:", error);
      resultsDiv.innerHTML = `<p class="no-results">Error loading results. Please try again later.</p>`;
    }
  });
});
