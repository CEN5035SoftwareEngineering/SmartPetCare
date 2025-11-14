// -------------------------------
// Initialize Back4App
// -------------------------------
Parse.initialize("fefJHvdGDQOAtrHXUOVnX62hq3s2KB8gUViNUWWP", "klHYFmiUyu9MhG0kVa4U5zjuyVyMD0oWpo33gHfb");
Parse.serverURL = "https://parseapi.back4app.com/";

// -------------------------------
// Auth Check
// -------------------------------
(async () => {
  const token = sessionStorage.getItem("sessionToken");
  if (!token) {
    console.warn("No token found — redirecting to login.");
    window.location.href = "../User_login_signup/login.html";
    return;
  }

  try {
    const user = await Parse.User.become(token);
    console.log("✅ Authenticated as:", user.getUsername());
  } catch (err) {
    console.error("❌ Invalid token:", err.message);
    sessionStorage.removeItem("sessionToken");
    window.location.href = "../User_login_signup/login.html";
  }
})();

// -------------------------------
// Date Picker
// -------------------------------
const dateStrip = document.getElementById("dateStrip");
let start = new Date();
start.setHours(0, 0, 0, 0);
let selectedDate = null;
let selectedTime = null;

// Helper functions
function formatDay(d) {
  return d.toLocaleDateString(undefined, { weekday: "short" });
}
function formatMD(d) {
  const m = d.toLocaleDateString(undefined, { month: "short" });
  return `${m} ${d.getDate()}`;
}

function renderStrip() {
  dateStrip.innerHTML = "";
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);

    const div = document.createElement("div");
    div.className = "date-pill";
    div.textContent = `${formatDay(d)}, ${formatMD(d)}`; // <-- Updated line

    if (!selectedDate && i === 0) selectedDate = new Date(d);
    if (selectedDate.toDateString() === d.toDateString()) div.classList.add("selected");

    div.addEventListener("click", () => {
      selectedDate = new Date(d);
      [...dateStrip.children].forEach((el) => el.classList.remove("selected"));
      div.classList.add("selected");
      renderTimes();
      checkReady();
    });

    dateStrip.appendChild(div);
  }
}


document.getElementById("prevWeek").addEventListener("click", () => {
  start.setDate(start.getDate() - 7);
  selectedDate = new Date(start);
  renderStrip();
  renderTimes();
  checkReady();
});

document.getElementById("nextWeek").addEventListener("click", () => {
  start.setDate(start.getDate() + 7);
  selectedDate = new Date(start);
  renderStrip();
  renderTimes();
  checkReady();
});

renderStrip();

// -------------------------------
// Time Slots
// -------------------------------
const timesMorning = ["9:00 AM", "9:30 AM", "10:30 AM"];
const timesAfternoon = ["12:00 PM", "1:30 PM", "3:00 PM"];

function renderTimeButtons(container, times) {
  container.innerHTML = "";
  times.forEach((t) => {
    const btn = document.createElement("div");
    btn.className = "times";
    btn.textContent = t;
    btn.addEventListener("click", () => {
      selectedTime = t;
      document.querySelectorAll("#timesMorning div, #timesAfternoon div").forEach((x) => x.classList.remove("selected"));
      btn.classList.add("selected");
      checkReady();
    });
    container.appendChild(btn);
  });
}

function renderTimes() {
  renderTimeButtons(document.getElementById("timesMorning"), timesMorning);
  renderTimeButtons(document.getElementById("timesAfternoon"), timesAfternoon);
}

renderTimes();

// -------------------------------
// Payment + Booking
// -------------------------------
const agree = document.getElementById("agree");
const bookBtn = document.getElementById("bookBtn");
const status = document.getElementById("status");

agree.addEventListener("change", checkReady);

function checkReady() {
  const ok = selectedDate && selectedTime && agree.checked;
  bookBtn.disabled = !ok;

  if (!selectedDate || !selectedTime) {
    status.textContent = "Select a date and time.";
  } else if (!agree.checked) {
    status.textContent = "Agree to terms to continue.";
  } else {
    status.textContent = "";
  }
}
checkReady();

// Stripe setup
const stripe = Stripe("pk_test_51SMxWc0f3wetAbTdVrFV7aMX1hZlvo6LPImQfMon4rmyQmkKzxCTtqTrwSBtXvoHRFyzNZa0YNgswVq6967ASi7G00l9AHh6q6"); // Replace with your Stripe public key
const elements = stripe.elements();
const card = elements.create("card", {
  style: {
    base: {
      fontSize: '16px',
      color: '#32325d',
      '::placeholder': { color: '#a0aec0' }
    }
  }
});
card.mount('#card-element');

card.on('change', (event) => {
  const displayError = document.getElementById('card-errors');
  displayError.textContent = event.error ? event.error.message : '';
});

bookBtn.addEventListener("click", async () => {
  if (bookBtn.disabled) return;

  // 1. Create Stripe token
  const {token, error} = await stripe.createToken(card);
  if (error) {
    alert(error.message);
    return;
  }

  // 2. Get current user
  const currentUser = Parse.User.current();
  if (!currentUser) {
    alert("Please log in before booking.");
    return;
  }

  try {
    const Booking = Parse.Object.extend("Booking");
    const booking = new Booking();

    // 3. Set fields
    booking.set("petParent", currentUser);
    booking.set("caretaker", {
      __type: "Pointer",
      className: "_User",
      objectId: caretakerId, // selected caretaker ID
    });
    booking.set("date", selectedDate);
    booking.set("time", selectedTime);
    
    // Optional: if you have service selection
    booking.set("service", document.getElementById("svcName").textContent);
    booking.set("price", parseFloat(document.getElementById("svcPrice").textContent.replace("$","")));
    
    booking.set("paymentStatus", "pending"); // until you process Stripe

    await booking.save();

    alert(`✅ Booking confirmed!\nDate: ${selectedDate.toLocaleDateString()}\nTime: ${selectedTime}`);

    // You could also redirect the user here or reset the form

  } catch (err) {
    console.error("Error saving booking:", err);
    alert("❌ Failed to save booking: " + err.message);
  }
});
