// Initialize Back4App
Parse.initialize("fefJHvdGDQOAtrHXUOVnX62hq3s2KB8gUViNUWWP", "klHYFmiUyu9MhG0kVa4U5zjuyVyMD0oWpo33gHfb");
Parse.serverURL = "https://parseapi.back4app.com/";
// Main code:

const dateStrip = document.getElementById("dateStrip");
let start = new Date();
start.setHours(0, 0, 0, 0);
let selectedDate = null;
let selectedTime = null;

// Example caretaker (replace with actual selected caretaker ID)
const caretakerId = "PUT_CARETAKER_OBJECT_ID_HERE"; // TODO: set dynamically

function formatDay(d) {
  return d.toLocaleDateString(undefined, { weekday: "short" });
}
function formatMD(d) {
  const m = d.toLocaleDateString(undefined, { month: "short" });
  const day = d.getDate();
  return `${m} ${day}`;
}

function renderStrip() {
  dateStrip.innerHTML = "";

  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "date-pill";
    btn.innerHTML = `
      <span class="top">${formatDay(d)}</span>
      <span class="bot">${formatMD(d)}</span>
    `;

    if (!selectedDate && i === 0) selectedDate = new Date(d);
    const isActive =
      selectedDate && d.toDateString() === selectedDate.toDateString();
    btn.setAttribute("aria-selected", isActive ? "true" : "false");

    btn.addEventListener("click", () => {
      selectedDate = new Date(d);
      [...dateStrip.children].forEach((el) =>
        el.setAttribute("aria-selected", "false")
      );
      btn.setAttribute("aria-selected", "true");
      renderTimes();
      checkReady();
    });

    dateStrip.appendChild(btn);
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

// Time slots
const timesMorning = ["9:00 AM", "9:30 AM", "10:30 AM"];
const timesAfternoon = ["12:00 PM", "1:30 PM", "3:00 PM"];

function renderTimeButtons(container, times) {
  container.innerHTML = "";
  times.forEach((t) => {
    const b = document.createElement("button");
    b.className =
      "px-4 py-2 rounded-xl border hover:bg-slate-50 data-[active=true]:bg-slate-900 data-[active=true]:text-white";
    b.textContent = t;
    b.addEventListener("click", () => {
      selectedTime = t;
      document
        .querySelectorAll("#timesMorning button, #timesAfternoon button")
        .forEach((x) => (x.dataset.active = "false"));
      b.dataset.active = "true";
      checkReady();
    });
    container.appendChild(b);
  });
}

function renderTimes() {
  renderTimeButtons(document.getElementById("timesMorning"), timesMorning);
  renderTimeButtons(document.getElementById("timesAfternoon"), timesAfternoon);
}

renderTimes();

// Booking submission
const agree = document.getElementById("agree");
agree.addEventListener("change", checkReady);
const bookBtn = document.getElementById("bookBtn");
const status = document.getElementById("status");

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

bookBtn.addEventListener("click", async () => {
  if (bookBtn.disabled) return;

  const currentUser = Parse.User.current();
  if (!currentUser) {
    alert("Please log in before booking.");
    return;
  }

  try {
    const Booking = Parse.Object.extend("Booking");
    const booking = new Booking();

    booking.set("petParent", currentUser);
    booking.set("caretaker", {
      __type: "Pointer",
      className: "_User",
      objectId: caretakerId,
    });
    booking.set("date", selectedDate);
    booking.set("time", selectedTime);

    await booking.save();

    alert(
      `✅ Booking confirmed!\nDate: ${selectedDate.toLocaleDateString()}\nTime: ${selectedTime}`
    );
  } catch (err) {
    console.error("Error saving booking:", err);
    alert("❌ Failed to save booking: " + err.message);
  }
});