
    async function jsonFetch(url, opts={}) {
      const res = await fetch(url, { headers: { "Content-Type":"application/json" }, ...opts });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || res.statusText);
      return data;
    }
      async function createFeedback() {
    // 1) Handle optional photo upload
    const fileInput = document.getElementById("photo");
    let photoName, photoBase64;

    if (fileInput && fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      photoName = file.name;

      // Convert image to base64
      photoBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result || "";
          const base64 = String(result).split(",")[1] || "";
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    // 2) Create the main feedback payload
    const body = {
      reviewerId: document.getElementById("reviewerId").value,
      role: document.getElementById("role").value,
      revieweeCaretakerId: document.getElementById("revieweeCaretakerId").value || undefined,
      revieweeDogId: document.getElementById("revieweeDogId").value || undefined,
      bookingId: document.getElementById("bookingId").value || undefined,
      rating: document.getElementById("rating").value,
      comment: document.getElementById("comment").value,

      // ✅ New photo fields
      photoName: photoName || undefined,
      photoBase64: photoBase64 || undefined,
    };

    // 3) Send to API
    try {
      const out = await jsonFetch("/api/feedback", {
        method: "POST",
        body: JSON.stringify(body),
      });
      document.getElementById("createOut").textContent = JSON.stringify(out, null, 2);
    } catch (e) {
      document.getElementById("createOut").textContent = e.message;
    }
  }

    async function editFeedback() {
      const id = document.getElementById("editId").value;
      const body = {
        reviewerId: document.getElementById("editReviewerId").value,
        rating: document.getElementById("editRating").value || undefined,
        comment: document.getElementById("editComment").value || undefined,
      };
      try {
        const out = await jsonFetch(`/api/feedback/${id}`, { method:"PUT", body: JSON.stringify(body) });
        document.getElementById("editOut").textContent = JSON.stringify(out, null, 2);
      } catch (e) {
        document.getElementById("editOut").textContent = e.message;
      }
    }
    async function reportFeedback() {
      const id = document.getElementById("reportId").value;
      const body = { reason: document.getElementById("reportReason").value };
      try {
        const out = await jsonFetch(`/api/feedback/${id}/report`, { method:"POST", body: JSON.stringify(body) });
        document.getElementById("reportOut").textContent = JSON.stringify(out, null, 2);
      } catch (e) {
        document.getElementById("reportOut").textContent = e.message;
      }
    }
    async function listCaretaker() {
      const id = document.getElementById("caretakerId").value;
      try {
        const out = await jsonFetch(`/api/feedback/caretaker/${id}`);
        document.getElementById("caretakerOut").textContent = JSON.stringify(out, null, 2);
      } catch (e) {
        document.getElementById("caretakerOut").textContent = e.message;
      }
    }
    async function listDog() {
      const id = document.getElementById("dogId").value;
      try {
        const out = await jsonFetch(`/api/feedback/dog/${id}`);
        document.getElementById("dogOut").textContent = JSON.stringify(out, null, 2);
      } catch (e) {
        document.getElementById("dogOut").textContent = e.message;
      }
    }
    async function summaryCaretaker() {
      const id = document.getElementById("sumCaretakerId").value;
      try {
        const out = await jsonFetch(`/api/feedback/caretaker/${id}/summary`);
        document.getElementById("summaryOut").textContent = JSON.stringify(out, null, 2);
      } catch (e) {
        document.getElementById("summaryOut").textContent = e.message;
      }
    }
  

// feedback.js
document.getElementById("feedbackForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();
  const successMsg = document.getElementById("successMsg");

  if (!name || !email || !message) {
    alert("Please fill out all fields.");
    return;
  }

  // Save feedback locally (for demo)
  const feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
  feedbacks.push({ name, email, message, timestamp: new Date().toISOString() });
  localStorage.setItem("feedbacks", JSON.stringify(feedbacks));

  // Reset form and show thank you
  document.getElementById("feedbackForm").reset();
  successMsg.style.display = "block";
});
