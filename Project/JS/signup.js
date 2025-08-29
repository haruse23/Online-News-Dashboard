document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();

    const usernameError = document.getElementById('usernameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const confirmError = document.getElementById('confirmError');

    // Reset errors
    usernameError.style.display = 'none';
    emailError.style.display = 'none';
    passwordError.style.display = 'none';
    confirmError.style.display = 'none';

    let isValid = true;

    // Username validation: no spaces and at least 4 characters/digits
    if (!username) {
        usernameError.textContent = 'Username is required';
        usernameError.style.display = 'block';
        isValid = false;
    } else if (username.length < 4) {
        usernameError.textContent = 'Username must be at least 4 characters';
        usernameError.style.display = 'block';
        isValid = false;
    } else if (/\s/.test(username)) {
        usernameError.textContent = 'Username cannot contain spaces';
        usernameError.style.display = 'block';
        isValid = false;
    }

    // Email validation
    if (!email) {
        emailError.textContent = 'Email is required';
        emailError.style.display = 'block';
        isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        emailError.textContent = 'Email is invalid';
        emailError.style.display = 'block';
        isValid = false;
    }

    // Password validation (8+ chars, mixed case, no spaces)
    if (!password) {
        passwordError.textContent = 'Password is required';
        passwordError.style.display = 'block';
        isValid = false;
    } else if (password.length < 8) {
        passwordError.textContent = 'Password must be at least 8 characters';
        passwordError.style.display = 'block';
        isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
        passwordError.textContent = 'Password must include both lowercase and uppercase letters';
        passwordError.style.display = 'block';
        isValid = false;
    } else if (/\s/.test(password)) {
        passwordError.textContent = 'Password cannot contain spaces';
        passwordError.style.display = 'block';
        isValid = false;
    }

    // Confirm password validation
    if (!confirmPassword) {
        confirmError.textContent = 'Please confirm password';
        confirmError.style.display = 'block';
        isValid = false;
    } else if (password !== confirmPassword) {
        confirmError.textContent = 'Passwords do not match';
        confirmError.style.display = 'block';
        isValid = false;
    }

    if (isValid) {
        // Save user to localStorage
        const user = { username, email, password };
        let users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Check if user already exists
        if (users.some(u => u.email === email)) {
            emailError.textContent = 'Email already registered';
            emailError.style.display = 'block';
            return;
        }
        
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        
        alert('Account created successfully!');
        window.location.href = 'login.html';
    }
});
