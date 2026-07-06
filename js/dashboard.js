async function loadUserData() {
  if (!currentUser) return;

  document.getElementById('dashboardUserName').textContent = currentUser.fullName.split(' ')[0];

  try {
    const [{ cvs }, { payments }] = await Promise.all([Api.listCVs(), Api.listPayments()]);

    const cvCount = cvs.length;
    const totalSpent = payments
      .filter((p) => p.status === 'completed')
      .reduce((sum, p) => sum + parseFloat(p.amount), 0)
      .toFixed(2);
    const daysActive = Math.max(1, Math.ceil((Date.now() - new Date(currentUser.createdAt).getTime()) / 86400000));

    document.getElementById('userCVCount').textContent = cvCount;
    document.getElementById('userTotalSpent').textContent = `$${totalSpent}`;
    document.getElementById('userDaysActive').textContent = daysActive;

    window._cvcraftCvs = cvs;
    window._cvcraftPayments = payments;

    const historyDiv = document.getElementById('combinedHistory');
    if (historyDiv.style.display !== 'none') {
      renderCombinedHistory(cvs, payments);
    }
  } catch (err) {
    showNotification(err.message || 'Could not load dashboard data.', 'error');
  }
}

function toggleHistory() {
  const historyDiv = document.getElementById('combinedHistory');
  const toggleBtn = document.getElementById('historyToggleBtn');

  if (historyDiv.style.display === 'none') {
    historyDiv.style.display = 'block';
    toggleBtn.innerHTML = '<i class="fas fa-eye-slash"></i> Hide History';
    renderCombinedHistory(window._cvcraftCvs || [], window._cvcraftPayments || []);
  } else {
    historyDiv.style.display = 'none';
    toggleBtn.innerHTML = '<i class="fas fa-eye"></i> Show History';
  }
}

function renderCombinedHistory(cvs, payments) {
  const container = document.getElementById('combinedHistory');

  const items = [
    ...cvs.map((cv) => ({ type: 'cv', timestamp: new Date(cv.created_at).getTime(), data: cv })),
    ...payments.map((p) => ({ type: 'payment', timestamp: new Date(p.created_at).getTime(), data: p }))
  ].sort((a, b) => b.timestamp - a.timestamp);

  if (items.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #666; padding: 15px; font-size: 0.9rem;">No activity yet. Create your first CV to see history here!</p>';
    return;
  }

  container.innerHTML = items.map((item) => {
    if (item.type === 'cv') {
      return `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: #f8f9fa; border-radius: 8px; margin-bottom: 8px; border-left: 3px solid #3498db;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <i class="fas fa-file-alt" style="color: #3498db; font-size: 0.9rem;"></i>
              <strong style="font-size: 0.9rem;">${escapeHtml(item.data.name)}</strong>
            </div>
            <div style="font-size: 0.8rem; color: #666;">Created: ${new Date(item.timestamp).toLocaleDateString()}</div>
          </div>
          <span style="padding: 2px 8px; background: #d4edda; color: #155724; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">CV</span>
        </div>
      `;
    }
    const statusClass = item.data.status === 'completed' ? 'status-success' : 'status-pending';
    return `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: #f8f9fa; border-radius: 8px; margin-bottom: 8px; border-left: 3px solid #27ae60;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <i class="fas fa-credit-card" style="color: #27ae60; font-size: 0.9rem;"></i>
            <strong style="font-size: 0.9rem;">CV Generation Payment</strong>
          </div>
          <div style="font-size: 0.8rem; color: #666;">${new Date(item.timestamp).toLocaleDateString()}</div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="padding: 2px 8px; background: #d1ecf1; color: #0c5460; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">$${item.data.amount}</span>
          <span class="status-badge ${statusClass}">${item.data.status}</span>
        </div>
      </div>
    `;
  }).join('');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ---- Profile page ----
function loadProfileData() {
  if (!currentUser) return;
  document.getElementById('profileAvatar').textContent = initialsOf(currentUser.fullName);
  document.getElementById('profileUserName').textContent = currentUser.fullName;
  document.getElementById('profileUserEmail').textContent = currentUser.email;

  const memberSince = new Date(currentUser.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  document.getElementById('profileMemberSince').textContent = memberSince;

  const [firstName, ...rest] = currentUser.fullName.split(' ');
  document.getElementById('profileFirstName').value = firstName || '';
  document.getElementById('profileLastName').value = rest.join(' ');
  document.getElementById('profileEmailEdit').value = currentUser.email;

  Promise.all([Api.listCVs(), Api.listPayments()]).then(([{ cvs }, { payments }]) => {
    document.getElementById('profileCVCount').textContent = cvs.length;
    const totalSpent = payments
      .filter((p) => p.status === 'completed')
      .reduce((sum, p) => sum + parseFloat(p.amount), 0)
      .toFixed(2);
    document.getElementById('profileTotalSpent').textContent = `$${totalSpent}`;
    const daysActive = Math.max(1, Math.ceil((Date.now() - new Date(currentUser.createdAt).getTime()) / 86400000));
    document.getElementById('profileDaysActive').textContent = daysActive;
    document.getElementById('profileLastLogin').textContent = new Date().toLocaleDateString();
  });
}

// NOTE: there is no PUT /api/auth/me endpoint yet in the backend scaffold -
// add one (update full_name/email on the users table) before wiring this up
// for real. Left as a clear call site so it's obvious where it plugs in.
function saveProfile() {
  showNotification('Profile editing needs a PUT /api/auth/me endpoint on the backend - see dashboard.js comment.', 'info');
}

function cancelProfileEdit() {
  loadProfileData();
  showNotification('Changes cancelled', 'info');
}

// ---- Settings page ----
function loadSettingsData() {
  const isDarkMode = document.body.classList.contains('dark-mode');
  document.getElementById('darkModeToggle').checked = isDarkMode;
  updateToggleAppearance('darkModeToggle', isDarkMode);
}

function updateToggleAppearance(toggleId, isChecked) {
  const toggle = document.getElementById(toggleId);
  const slider = toggle.nextElementSibling;
  const knob = slider.nextElementSibling;
  if (isChecked) {
    slider.style.backgroundColor = '#3498db';
    knob.style.transform = 'translateX(26px)';
  } else {
    slider.style.backgroundColor = '#ccc';
    knob.style.transform = 'translateX(0px)';
  }
}

function toggleThemeFromSettings() {
  toggleTheme();
  updateToggleAppearance('darkModeToggle', document.body.classList.contains('dark-mode'));
}

function saveSettings() {
  localStorage.setItem('cvcraft_settings', JSON.stringify({ darkMode: document.body.classList.contains('dark-mode') }));
  showNotification('Settings saved successfully!', 'success');
}

// NOTE: needs a PUT /api/auth/password endpoint (verify current password,
// bcrypt-hash and store the new one) on the backend.
function changePasswordFromSettings() {
  showNotification('Password change needs a backend endpoint - see dashboard.js comment.', 'info');
}

function clearHistory() {
  showNotification('Deleting CVs/payments in bulk needs a dedicated backend endpoint you opt into deliberately - not wired up by default for safety.', 'info');
}

function clearAllData() {
  showNotification('This is a destructive bulk-delete - add and confirm a real backend endpoint before enabling it.', 'info');
}

function deleteAccount() {
  showNotification('Account deletion needs a DELETE /api/auth/me endpoint on the backend - see dashboard.js comment.', 'info');
}
