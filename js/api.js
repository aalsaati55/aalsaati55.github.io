async function login(username, password) {
    const credentials = btoa(`${username}:${password}`);
    
    const response = await fetch('https://learn.reboot01.com/api/auth/signin', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        const data = await response.json();
        if (data && typeof data === 'string' && data.split('.').length === 3) {
            localStorage.setItem('jwt', data);
            return { success: true, token: data };
        }
    }
    throw new Error('Invalid credentials or token format');
}
