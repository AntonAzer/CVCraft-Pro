function hideAllPages() {
  document.getElementById('dashboard').classList.remove('active');
  document.getElementById('cvBuilder').classList.remove('active');
  document.getElementById('featuresPage').style.display = 'none';
  document.getElementById('profilePage').style.display = 'none';
  document.getElementById('settingsPage').style.display = 'none';
}

function showHome() {
  hideAllPages();
  if (currentUser) showDashboard();
  else showCVBuilder();
}

function showDashboard() {
  hideAllPages();
  document.getElementById('dashboard').classList.add('active');
  loadUserData();
}

function showCVBuilder() {
  hideAllPages();
  document.getElementById('cvBuilder').classList.add('active');
  resetCvBuilderState();
}

function showFeatures() {
  hideAllPages();
  document.getElementById('featuresPage').style.display = 'block';
}

function showProfile() {
  hideAllPages();
  document.getElementById('profilePage').style.display = 'block';
  loadProfileData();
}

function showSettings() {
  hideAllPages();
  document.getElementById('settingsPage').style.display = 'block';
  loadSettingsData();
}

function toggleMobileNav() {
  document.getElementById('navbarNav').classList.toggle('mobile-open');
}

function closeMobileNav() {
  document.getElementById('navbarNav').classList.remove('mobile-open');
}

document.addEventListener('click', (event) => {
  const nav = document.getElementById('navbarNav');
  const toggle = document.getElementById('navbarToggle');
  if (nav && nav.classList.contains('mobile-open') &&
      !nav.contains(event.target) && !toggle.contains(event.target)) {
    closeMobileNav();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  loadTheme();
  bindCvInputs();
  renderTemplate(currentTemplate);
  updatePreview();
  checkAuthStatus();
});
