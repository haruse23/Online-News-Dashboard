document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const emailError = document.getElementById('loginEmailError');
    const passwordError = document.getElementById('loginPasswordError');
    
    // Reset errors
    emailError.style.display = 'none';
    passwordError.style.display = 'none';
    
    let isValid = true;
    
    // Email validation
    if (!email) {
        emailError.textContent = 'Email is required';
        emailError.style.display = 'block';
        isValid = false;
    }
    
    // Password validation
    if (!password) {
        passwordError.textContent = 'Password is required';
        passwordError.style.display = 'block';
        isValid = false;
    }
    
    if (isValid) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Store logged-in user in session
            sessionStorage.setItem('loggedIn', 'true');
            sessionStorage.setItem('username', user.username);
            sessionStorage.setItem('email', user.email);
            window.location.href = 'home.html';
        } else {
            passwordError.textContent = 'Invalid email or password';
            passwordError.style.display = 'block';
        }
    }
});