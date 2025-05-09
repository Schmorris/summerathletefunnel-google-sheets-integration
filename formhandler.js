// formhandler.js – unify quiz & freeworkoutgate form handling

console.log("🔥 formhandler.js – Startpunkt erreicht");

document.addEventListener("DOMContentLoaded", () => {
  console.log("🔥 DOMContentLoaded wurde ausgelöst.");

  // Überwache das DOM auf neue Formulare mit der Klasse "js-zapform"
  const observer = new MutationObserver(() => {
    const forms = document.querySelectorAll("form.js-zapform");

    console.log("Gefundene Formulare mit Klasse 'js-zapform':", forms.length);

    forms.forEach(form => {
      if (!form.dataset.listenerAdded) {
        console.log("Formular gefunden und Event Listener hinzugefügt:", form);
        form.onsubmit = handleFormSubmit;
        form.dataset.listenerAdded = "true"; // Verhindert doppelte Registrierung
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
});

function injectHiddenData() {
  console.log("🔍 injectHiddenData() gestartet.");

  const goalInput = document.getElementById("goalInput");
  const frequencyInput = document.getElementById("frequencyInput");
  const interestInput = document.getElementById("interestInput");

  if (!goalInput || !frequencyInput || !interestInput) {
    console.warn("⚠️ Hidden input fields not found!");
    return;
  }

  // Setze die Werte der versteckten Felder
  goalInput.value = answers.goal || "";
  frequencyInput.value = answers.frequency || "";
  interestInput.value = answers.interest || "";

  console.log("✅ Data injected:", {
    goal: goalInput.value,
    frequency: frequencyInput.value,
    interest: interestInput.value
  });
}

function handleFormSubmit(event) {
  event.preventDefault();
  console.log("🚀 handleFormSubmit() wurde aufgerufen.");

  const form = event.target;
  const email = form.querySelector('input[type="email"]');
  const consent = form.querySelector('input[type="checkbox"]');
  const errorBox = form.querySelector('.consent-error');

  if (consent && !consent.checked) {
    console.warn("⚠️ Consent checkbox ist nicht angehakt.");
    if (errorBox) errorBox.style.display = 'block';
    return false;
  } else {
    if (errorBox) errorBox.style.display = 'none';
  }

  if (typeof injectHiddenData === "function") {
    console.log("✅ injectHiddenData() wird ausgeführt.");
    injectHiddenData();
  }

  const formData = new FormData(form);

  console.log("📦 Form data before send:", {
    goal: formData.get("goal"),
    frequency: formData.get("frequency"),
    interest: formData.get("interest"),
    email: formData.get("email")
  });

  fetch("https://hooks.zapier.com/hooks/catch/19943755/2n6n22s/", {
    method: "POST",
    body: formData
  })
    .then(() => {
      console.log("✅ Form successfully submitted to Zapier.");
      setTimeout(() => {
        console.log("🔄 Redirecting to index.html");
        window.location.href = "index.html";
      }, 2000);
    })
    .catch((err) => {
      console.error("❌ Form submission failed:", err);
    });

  return false;
}
