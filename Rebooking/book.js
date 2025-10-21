// book.js
document.getElementById("bookingForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const petName = document.getElementById("petName").value.trim();
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const notes = document.getElementById("notes").value.trim();
  const successMsg = document.getElementById("successMsg");

  if (!name || !email || !petName || !date || !time) {
    alert("Please fill out all required fields.");
    return;
  }

  const bookings = JSON.parse(localStorage.getItem("bookings")) || [];

  const newBooking = {
    name,
    email,
    petName,
    date,
    time,
    notes,
    timestamp: new Date().toISOString()
  };

  bookings.push(newBooking);
  localStorage.setItem("bookings", JSON.stringify(bookings));

  document.getElementById("bookingForm").reset();
  successMsg.style.display = "block";
});
