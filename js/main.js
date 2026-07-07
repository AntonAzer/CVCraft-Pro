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

document.addEventListener('DOMContentLoaded', () => {
  loadTheme();
  bindCvInputs();
  renderTemplate(currentTemplate);
  updatePreview();
  checkAuthStatus();
});
