    const svc = { name: "Full Grooming", price: "$85", duration: "90 minutes", desc: "A head-to-tail service including bath, haircut, nail trim, ear cleaning, and brushing." };
    const svcName = document.getElementById('svcName');
    const svcPrice = document.getElementById('svcPrice');
    const svcDuration = document.getElementById('svcDuration');
    const svcDesc = document.getElementById('svcDesc');
    const changeLink = document.getElementById('changeService');
    const svcList = document.getElementById('serviceList');
    changeLink.addEventListener('click', (e)=>{ e.preventDefault(); svcList.classList.toggle('hidden'); });

    document.querySelectorAll('.pickService').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        svc.name = btn.dataset.name;
        svc.price = btn.dataset.price;
        svc.duration = btn.dataset.duration;
        svc.desc = btn.dataset.desc;
        svcName.textContent = svc.name;
        svcPrice.textContent = svc.price;
        svcDuration.textContent = svc.duration;
        svcDesc.textContent = svc.desc;
        svcList.classList.add('hidden');
        checkReady();
      });
    });
const dateStrip = document.getElementById('dateStrip');
  let start = new Date(); start.setHours(0,0,0,0);
  let selectedDate = null;

  function formatDay(d){ return d.toLocaleDateString(undefined, { weekday: 'short' }); }
  function formatMD(d){  // e.g., Nov 4
    const m = d.toLocaleDateString(undefined, { month: 'short' });
    const day = d.getDate();
    return `${m} ${day}`;
  }

  function renderStrip(){
    dateStrip.innerHTML = '';

    for (let i = 0; i < 7; i++) {
      const d = new Date(start); d.setDate(start.getDate() + i);

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'date-pill';
      btn.innerHTML = `
        <span class="top">${formatDay(d)}</span>
        <span class="bot">${formatMD(d)}</span>
      `;

      // Select first day by default if nothing selected yet
      if (!selectedDate && i === 0) selectedDate = new Date(d);

      const isActive = selectedDate && d.toDateString() === selectedDate.toDateString();
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');

      btn.addEventListener('click', () => {
        selectedDate = new Date(d);
        [...dateStrip.children].forEach(el => el.setAttribute('aria-selected','false'));
        btn.setAttribute('aria-selected','true');
        renderTimes();    // your existing function
        checkReady();     // your existing function
      });

      dateStrip.appendChild(btn);
    }
  }

  document.getElementById('prevWeek').addEventListener('click', () => {
    start.setDate(start.getDate() - 7);
    // keep selectedDate in range by snapping to first day in view
    selectedDate = new Date(start);
    renderStrip(); renderTimes(); checkReady();
  });

  document.getElementById('nextWeek').addEventListener('click', () => {
    start.setDate(start.getDate() + 7);
    selectedDate = new Date(start);
    renderStrip(); renderTimes(); checkReady();
  });

  renderStrip(); // initial render
    // const dateStrip = document.getElementById('dateStrip');
    // let start = new Date();
    // start.setHours(0,0,0,0);
    // let selectedDate = null;
    // function formatDay(d){ return d.toLocaleDateString(undefined, { weekday: 'short' }); }
    // function formatMD(d){ return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }); }
    // function renderStrip(){
    //   dateStrip.innerHTML = '';
    //   for(let i=0;i<7;i++){
    //     const d = new Date(start); d.setDate(start.getDate()+i);
    //     const btn = document.createElement('button');
    //     btn.className = 'px-4 py-3 rounded-xl border hover:bg-slate-50 data-[active=true]:bg-[var(--brand)] data-[active=true]:text-white';
    //     btn.innerHTML = `<div class="text-sm">${formatDay(d)}</div><div class="text-xs opacity-80">${formatMD(d)}</div>`;
    //     btn.dataset.iso = d.toISOString();
    //     btn.addEventListener('click', ()=>{
    //       selectedDate = d;
    //       Array.from(dateStrip.children).forEach(b=>b.dataset.active = 'false');
    //       btn.dataset.active = 'true';
    //       renderTimes();
    //       checkReady();
    //     });
    //     dateStrip.appendChild(btn);
    //     if(selectedDate && d.toDateString()===selectedDate.toDateString()){ btn.dataset.active='true'; }
    //   }
    // }
    // document.getElementById('prevWeek').addEventListener('click', ()=>{ start.setDate(start.getDate()-7); renderStrip(); });
    // document.getElementById('nextWeek').addEventListener('click', ()=>{ start.setDate(start.getDate()+7); renderStrip(); });
    // renderStrip();

    let selectedTime = null;
    const timesMorning = ["9:00 AM","9:30 AM","10:30 AM"];
    const timesAfternoon = ["12:00 PM","1:30 PM","3:00 PM"];
    function renderTimeButtons(container, times){
      container.innerHTML = '';
      times.forEach(t=>{
        const b = document.createElement('button');
        b.className = 'px-4 py-2 rounded-xl border hover:bg-slate-50 data-[active=true]:bg-slate-900 data-[active=true]:text-white';
        b.textContent = t;
        b.addEventListener('click', ()=>{
          selectedTime = t;
          document.querySelectorAll('#timesMorning button, #timesAfternoon button').forEach(x=>x.dataset.active='false');
          b.dataset.active='true';
          checkReady();
        });
        container.appendChild(b);
      });
    }
    function renderTimes(){
      renderTimeButtons(document.getElementById('timesMorning'), timesMorning);
      renderTimeButtons(document.getElementById('timesAfternoon'), timesAfternoon);
    }
    renderTimes();

    let stripe, elements, cardElement, cardComplete = false;
    const publishableKey = "51SMxXA1ynOOwhQJtQzgCz8KCFqVRu9pJTxv3Gtzq0nSPc4MfTSMQiXEV57WgAU0npQgsoj5hYfSxukJlvS50VqsO004NJJ8aEJ"; // Replace with your real key
    if (window.Stripe && publishableKey && !publishableKey.includes("REPLACE_ME")) {
      stripe = Stripe("pk_test_51SMxXA1ynOOwhQJtQzgCz8KCFqVRu9pJTxv3Gtzq0nSPc4MfTSMQiXEV57WgAU0npQgsoj5hYfSxukJlvS50VqsO004NJJ8aEJ");
      elements = stripe.elements();
      cardElement = elements.create('card', { hidePostalCode: false });
      cardElement.mount('#card-element');
      cardElement.on('change', ({complete, error})=>{
        cardComplete = complete;
        document.getElementById('card-errors').textContent = error ? error.message : '';
        checkReady();
      });
    } else {
      document.getElementById('card-element').innerHTML = '<div class="text-sm text-[var(--text-muted)]">Add your Stripe publishable key in the code to enable the secure card field.</div>';
    }

    const agree = document.getElementById('agree');
    agree.addEventListener('change', checkReady);
    const bookBtn = document.getElementById('bookBtn');
    const status = document.getElementById('status');

    function checkReady(){
      const ok = svc.name && selectedDate && selectedTime && (cardComplete || (stripe===undefined)) && agree.checked;
      bookBtn.disabled = !ok;
      if(!svc.name || !selectedDate || !selectedTime){
        status.textContent = 'Select service, date, and time.';
      } else if (stripe && !cardComplete){
        status.textContent = 'Enter your card details to proceed.';
      } else if (!agree.checked){
        status.textContent = 'Agree to terms to continue.';
      } else {
        status.textContent = '';
      }
    }
    checkReady();

    bookBtn.addEventListener('click', async ()=>{
      if(bookBtn.disabled) return;
      const summary = `${svc.name} on ${selectedDate.toLocaleDateString()} at ${selectedTime} for ${svc.price}`;
      alert('Request submitted: ' + summary + '\n\nNOTE: Wire this to your backend to complete payment and booking.');
    });
