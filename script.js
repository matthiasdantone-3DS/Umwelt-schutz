// Mobiles Menü öffnen und schließen
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.classList.toggle('open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Menü schließen' : 'Menü öffnen');
});

// Menü schließen, wenn ein Link angeklickt wird
mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Menü öffnen');
  });
});

// Karten beim Scrollen einblenden
const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

// Aktiven Menüpunkt beim Scrollen markieren
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.main-nav a');

function updateActiveLink() {
  let currentId = '';
  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 120) {
      currentId = section.id;
    }
  });
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
  });
}

window.addEventListener('scroll', updateActiveLink);
updateActiveLink();

// Interaktive Checkliste
const checkboxes = document.querySelectorAll('#checklist input[type="checkbox"]');
const progressText = document.getElementById('progressText');
const progressPercent = document.getElementById('progressPercent');
const progressFill = document.getElementById('progressFill');
const progressBar = document.getElementById('progressBar');
const progressMessage = document.getElementById('progressMessage');
const resetButton = document.getElementById('resetButton');
const STORAGE_KEY = 'gruenepause-checkliste';

// Motivierende Nachricht passend zum Fortschritt wählen
function getMessage(done, total) {
  if (done === 0) return "Los geht's! Jeder Haken zählt.";
  if (done < total / 2) return 'Guter Start! Mach weiter so.';
  if (done < total) return 'Super, du bist schon auf einem tollen Weg!';
  return 'Fantastisch! Du bist ein echter Umweltheld! 🌟';
}

// Fortschrittsanzeige aktualisieren
function updateProgress() {
  const total = checkboxes.length;
  const done = Array.from(checkboxes).filter((box) => box.checked).length;
  const percent = Math.round((done / total) * 100);

  progressText.textContent = done + ' von ' + total + ' Aufgaben erledigt';
  progressPercent.textContent = percent + ' %';
  progressFill.style.width = percent + '%';
  progressBar.setAttribute('aria-valuenow', String(percent));
  progressMessage.textContent = getMessage(done, total);
}

// Auswahl im Browser speichern
function saveState() {
  try {
    const state = Array.from(checkboxes).map((box) => box.checked);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    // Speichern nicht möglich, die Checkliste funktioniert trotzdem
  }
}

// Gespeicherte Auswahl laden
function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved)) {
      checkboxes.forEach((box, index) => {
        box.checked = Boolean(saved[index]);
      });
    }
  } catch (error) {
    // Ohne gespeicherte Daten starten wir leer
  }
}

checkboxes.forEach((box) => {
  box.addEventListener('change', () => {
    updateProgress();
    saveState();
  });
});

resetButton.addEventListener('click', () => {
  checkboxes.forEach((box) => {
    box.checked = false;
  });
  updateProgress();
  saveState();
});

loadState();
updateProgress();

// Fakten-Karten auf- und zuklappen
document.querySelectorAll('.fact').forEach((fact) => {
  fact.addEventListener('click', () => {
    const isOpen = fact.classList.toggle('open');
    fact.setAttribute('aria-expanded', String(isOpen));
  });
});
