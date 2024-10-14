document.addEventListener('DOMContentLoaded', () => {
    initializeLogin();
    initializeLogout();
    checkAuthStatus();
  });
  
  function initializeLogout() {
    const logoutButton = document.getElementById('logout-button');
    logoutButton.addEventListener('click', () => {
      localStorage.removeItem('jwt');
      checkAuthStatus();
    });
  }
  
  function checkAuthStatus() {
    const token = localStorage.getItem('jwt');
    const loginContainer = document.getElementById('login-container');
    const profileContainer = document.getElementById('profile-container');
    const logoutButton = document.getElementById('logout-button');

    if (token) {
        loginContainer.style.display = 'none';
        profileContainer.style.display = 'block';
        logoutButton.style.display = 'block';
        loadProfile();
        } else {
        loginContainer.style.display = 'block';
        profileContainer.style.display = 'none';
        logoutButton.style.display = 'none';
    }
}

  
  
  
  
  