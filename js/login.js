function initializeLogin() {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const result = await login(username, password);
            if (result.success && result.token) {
                localStorage.setItem('jwt', result.token);
                document.getElementById('login-container').style.display = 'none';
                document.getElementById('profile-container').style.display = 'block';
                document.getElementById('logout-button').style.display = 'block';
                loadProfile();
            } else {
                throw new Error('Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            errorMessage.textContent = error.message || 'An error occurred. Please try again.';
        }
    });
}
