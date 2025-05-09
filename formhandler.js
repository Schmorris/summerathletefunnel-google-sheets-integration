// formhandler.js – unify quiz & freeworkoutgate form handling

console.log("🔥 formhandler.js – Startpunkt erreicht");

const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbxXESVn1gfNsKIWJGoKpspHCWKYDQaey1eJXAZfRAHXNYR0pLL4P7nqLpXTI1VLx0D-iQ/exec";

document.addEventListener("DOMContentLoaded", () => {
  console.log("🔥 DOMContentLoaded wurde ausgelöst.");

  const observer = new MutationObserver(() => {
    const forms = document.querySelectorAll("form.js-zapform");

    console.log("Gefundene Formulare mit Klasse 'js-zapform':", forms.length);

    forms.forEach(form => {
      if (!form.dataset.listenerAdded) {
        console.log("Formular gefunden und Event Listener hinzugefügt:", form);
        form.onsubmit = handleFormSubmit;
        form.dataset.listenerAdded = "true";
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
});

function handleFormSubmit(event) {
  event.preventDefault();
  console.log("🚀 handleFormSubmit() wurde aufgerufen.");

  const form = event.target;
  const email = form.querySelector('input[type="email"]')?.value || "";
  const goal = document.getElementById("goalInput")?.value || "";
  const frequency = document.getElementById("frequencyInput")?.value || "";
  const interest = document.getElementById("interestInput")?.value || "";

  const formData = {
    email,
    goal,
    frequency,
    interest
  };

  console.log("📦 Form data before send:", formData);

  fetch(GOOGLE_SHEET_URL, {
    method: "POST",
    header: { 
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData),
    mode: "cors"
  })
    .then(response => response.json())
    .then(data => {
      console.log("✅ Data successfully sent to Google Sheets:", data);
      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
    })
    .catch(err => {
      console.error("❌ Data submission failed:", err);
    });

  return false;
}


function sendFormData(formData) {
  return fetch(GOOGLE_SHEET_URL, {
    method: "POST",
    mode: "cors", // Explizit CORS-Modus aktivieren
    credentials: "omit", // Keine Cookies senden
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  })
  .then(response => {
    console.log("🌐 Antwort vom Server erhalten:", response);
    console.log("🌐 Antwort-Status:", response.status);
    console.log("🌐 Antwort-Headers:", {
      "Content-Type": response.headers.get("Content-Type"),
      "Access-Control-Allow-Origin": response.headers.get("Access-Control-Allow-Origin")
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }

    return response.json();
  })
  .then(data => {
    console.log("✅ Data successfully sent to Google Sheets:", data);
    if (data.status === "success") {
      console.log("✅ Weiterleitung zur Startseite in 2 Sekunden...");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
    } else {
      console.warn("❌ Fehlerhafte Antwort vom Server:", data.message);
    }
  })
  .catch(err => {
    console.error("❌ Data submission failed:", err);
    console.error("❌ Detaillierter Fehler:", {
      message: err.message,
      stack: err.stack
    });
    // Optional: Zeige einen Fehler für den Benutzer an
    alert("Es gab ein Problem beim Senden deiner Daten. Bitte versuche es später noch einmal.");
  });
}