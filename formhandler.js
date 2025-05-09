// formhandler.js – unify quiz & freeworkoutgate form handling

console.log("🔥 formhandler.js – Startpunkt erreicht");

const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbzUZc3kvYTXO3BZ3MXewGSntkLzuNTMCtqKQpUsV2gU628xb4q_I8pLGYVVX4akdPJDQg/exec";

document.addEventListener("DOMContentLoaded", () => {
  console.log("🔥 DOMContentLoaded wurde ausgelöst.");

  // Überprüfe, ob Formulare existieren
  const forms = document.querySelectorAll("form.js-zapform");
  console.log(`Gefundene Formulare mit 'js-zapform': ${forms.length}`);

  forms.forEach(form => {
    if (!form.dataset.listenerAdded) {
      console.log("Formular gefunden und Event Listener hinzugefügt:", form);
      form.onsubmit = handleFormSubmit;
      form.dataset.listenerAdded = "true";
    }
  });

  // Überwache DOM-Änderungen, falls das Formular später hinzugefügt wird
  const observer = new MutationObserver(() => {
    const updatedForms = document.querySelectorAll("form.js-zapform");
    console.log(`DOM geändert. Neue Formulare gefunden: ${updatedForms.length}`);

    updatedForms.forEach(form => {
      if (!form.dataset.listenerAdded) {
        console.log("Neues Formular gefunden und Event Listener hinzugefügt:", form);
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

  // Prüfen, ob das Formular korrekt selektiert wurde
  if (!form) {
    console.warn("❌ Formular konnte nicht gefunden werden.");
    return;
  }

  const email = form.querySelector('input[type="email"]')?.value.trim() || "";
  const goal = document.getElementById("goalInput")?.value.trim() || "";
  const frequency = document.getElementById("frequencyInput")?.value.trim() || "";
  const interest = document.getElementById("interestInput")?.value.trim() || "";

  const formData = { email, goal, frequency, interest };

  console.log("📦 Form data before send:", formData);

  // Überprüfen, ob alle Felder gefüllt sind
  if (!email || !goal || !frequency || !interest) {
    console.warn("⚠️ Nicht alle Formulardaten sind ausgefüllt!");
    alert("Bitte alle Felder ausfüllen, bevor du das Formular absendest.");
    return;
  }

  sendFormData(formData);
}

function sendFormData(formData) {
  console.log("📤 Sende Daten an Google Apps Script...");

  fetch(GOOGLE_SHEET_URL, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  })
    .then(response => {
      console.log("🌐 Antwort vom Server erhalten:", response);
      console.log("🌐 Antwort-Status:", response.status);

      const contentType = response.headers.get("Content-Type");
      console.log("Content-Type der Antwort:", contentType);

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      if (contentType && contentType.includes("application/json")) {
        return response.json();
      } else {
        throw new Error("Antwort ist kein JSON.");
      }
    })
    .then(data => {
      console.log("✅ Erfolgreich gesendet:", data);

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
      console.error("❌ Fehler beim Senden der Daten:", err.message);
      console.error("❌ Detaillierter Fehler:", err);
      alert("Es gab ein Problem beim Senden der Daten. Überprüfe die Konsole für Details.");
    });
}
