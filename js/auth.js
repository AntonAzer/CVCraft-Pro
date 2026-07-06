let currentUser = null; // { id, fullName, email, createdAt }

function showAuthModal(type) {
  document.getElementById('authModal').classList.add('active');
  switchAuthTab(type);
}

function closeAuthModal() {
  document.getElementById('authModal').classList.remove('active');
}

function switchAuthTab(type) {
  document.querySelectorAll('.auth-tab').forEach((tab) => tab.classList.remove('active'));
  document.querySelectorAll('.auth-form').forEach((form) => form.classList.remove('active'));

  if (type === 'login') {
    document.querySelector('.auth-tab:first-child').classList.add('active');
    document.getElementById('loginForm').classList.add('active');
    document.getElementById('modalTitle').textContent = 'Welcome Back!';
    document.getElementById('modalSubtitle').textContent = 'Sign in to access your dashboard';
  } else if (type === 'signup') {
    document.querySelector('.auth-tab:last-child').classList.add('active');
    document.getElementById('signupForm').classList.add('active');
    document.getElementById('modalTitle').textContent = 'Join CVCraft Pro';
    document.getElementById('modalSubtitle').textContent = 'Create your account in seconds';
  }
}

function showForgotPassword() {
  document.querySelectorAll('.auth-form').forEach((form) => form.classList.remove('active'));
  document.getElementById('forgotForm').classList.add('active');
  document.getElementById('modalTitle').textContent = 'Reset Password';
  document.getElementById('modalSubtitle').textContent = 'Enter your email to receive reset instructions';
}

async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const { token, user } = await Api.login(email, password);
    Api.setToken(token);
    currentUser = user;
    closeAuthModal();
    showUserInterface();
    showNotification('Welcome back! Login successful.', 'success');
  } catch (err) {
    showNotification(err.message || 'Invalid email or password.', 'error');
  }
}

async function handleSignup(event) {
  event.preventDefault();
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const agreeTerms = document.getElementById('agreeTerms').checked;

  if (password !== confirmPassword) {
    showNotification('Passwords do not match!', 'error');
    return;
  }
  if (!agreeTerms) {
    showNotification('Please agree to the Terms of Service and Privacy Policy.', 'error');
    return;
  }

  try {
    const { token, user } = await Api.signup(name, email, password);
    Api.setToken(token);
    currentUser = user;
    closeAuthModal();
    showUserInterface();
    showNotification('Account created successfully! Welcome to CVCraft Pro.', 'success');
  } catch (err) {
    showNotification(err.message || 'Could not create account.', 'error');
  }
}

async function handleForgotPassword(event) {
  event.preventDefault();
  const email = document.getElementById('forgotEmail').value;
  try {
    const { message } = await Api.forgotPassword(email);
    showNotification(message, 'success');
    setTimeout(() => switchAuthTab('login'), 2000);
  } catch (err) {
    showNotification(err.message || 'Something went wrong.', 'error');
  }
}

function logout() {
  Api.setToken(null);
  currentUser = null;
  showGuestInterface();
  showNotification('Logged out successfully!', 'success');
}

async function checkAuthStatus() {
  if (!Api.isLoggedIn()) {
    showGuestInterface();
    return;
  }
  try {
    const { user } = await Api.me();
    currentUser = user;
    showUserInterface();
  } catch (err) {
    // Token expired/invalid
    Api.setToken(null);
    showGuestInterface();
  }
}

function showUserInterface() {
  document.getElementById('authButtons').style.display = 'none';
  document.getElementById('userMenu').style.display = 'block';
  document.getElementById('userAvatar').textContent = initialsOf(currentUser.fullName);
  document.getElementById('dashboardUserName').textContent = currentUser.fullName.split(' ')[0];
  showDashboard();
}

function showGuestInterface() {
  document.getElementById('authButtons').style.display = 'flex';
  document.getElementById('userMenu').style.display = 'none';
  showCVBuilder();
}

function initialsOf(fullName) {
  return fullName.split(' ').map((n) => n[0]).join('').toUpperCase();
}

function toggleUserMenu() {
  const dropdown = document.getElementById('userDropdown');
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

document.addEventListener('click', (event) => {
  const userMenu = document.getElementById('userMenu');
  const dropdown = document.getElementById('userDropdown');
  if (userMenu && dropdown && !userMenu.contains(event.target)) {
    dropdown.style.display = 'none';
  }
});

function loginWithGoogle() { showNotification('Google login integration coming soon! Please use email login for now.', 'info'); }
function loginWithFacebook() { showNotification('Facebook login integration coming soon! Please use email login for now.', 'info'); }
function signupWithGoogle() { showNotification('Google signup integration coming soon! Please use email signup for now.', 'info'); }
function signupWithFacebook() { showNotification('Facebook signup integration coming soon! Please use email signup for now.', 'info'); }
