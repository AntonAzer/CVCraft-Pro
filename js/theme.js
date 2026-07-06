function toggleTheme() {
  const body = document.body;
  const themeToggle = document.querySelector('.theme-toggle');
  body.classList.toggle('dark-mode');

  if (body.classList.contains('dark-mode')) {
    themeToggle.textContent = '☀️';
    localStorage.setItem('cvcraft_theme', 'dark');
  } else {
    themeToggle.textContent = '🌙';
    localStorage.setItem('cvcraft_theme', 'light');
  }
}

function loadTheme() {
  const savedTheme = localStorage.getItem('cvcraft_theme');
  const body = document.body;
  const themeToggle = document.querySelector('.theme-toggle');

  if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.textContent = '☀️';
  } else {
    themeToggle.textContent = '🌙';
  }
}
