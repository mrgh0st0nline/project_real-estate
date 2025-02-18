document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const inputs = form.querySelectorAll('input');

    // Show error message
    const showError = (input, message) => {
        const errorElement = input.parentElement.querySelector('.error-message');
        errorElement.textContent = message;
        input.classList.add('error');
    };

    // Clear error message
    const clearError = (input) => {
        const errorElement = input.parentElement.querySelector('.error-message');
        errorElement.textContent = '';
        input.classList.remove('error');
    };

    // Validate email format
    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // Validate phone number
    const isValidPhone = (phone) => {
        return /^\d{10}$/.test(phone);
    };

    // Input validation
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            clearError(input);
            
            if (input.id === 'confirmPassword') {
                const password = document.getElementById('password');
                if (input.value !== password.value) {
                    showError(input, 'Passwords do not match');
                }
            }
        });
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        let isValid = true;

        // Validate all inputs
        inputs.forEach(input => {
            clearError(input);

            if (input.required && !input.value.trim()) {
                showError(input, 'This field is required');
                isValid = false;
            }

            switch (input.id) {
                case 'fullname':
                    if (input.value.length < 2) {
                        showError(input, 'Name must be at least 2 characters long');
                        isValid = false;
                    }
                    if (!/^[A-Za-z ]+$/.test(input.value)) {
                        showError(input, 'Name can only contain letters and spaces');
                        isValid = false;
                    }
                    break;

                case 'username':
                    if (input.value.length < 3) {
                        showError(input, 'Username must be at least 3 characters long');
                        isValid = false;
                    }
                    if (!/^[A-Za-z0-9_]+$/.test(input.value)) {
                        showError(input, 'Username can only contain letters, numbers, and underscores');
                        isValid = false;
                    }
                    break;

                case 'email':
                    if (!isValidEmail(input.value)) {
                        showError(input, 'Please enter a valid email address');
                        isValid = false;
                    }
                    break;

                case 'phone':
                    if (!isValidPhone(input.value)) {
                        showError(input, 'Please enter a valid 10-digit phone number');
                        isValid = false;
                    }
                    break;

                case 'password':
                    if (input.value.length < 8) {
                        showError(input, 'Password must be at least 8 characters long');
                        isValid = false;
                    }
                    break;

                case 'confirmPassword':
                    const password = document.getElementById('password');
                    if (input.value !== password.value) {
                        showError(input, 'Passwords do not match');
                        isValid = false;
                    }
                    break;

                case 'terms':
                    if (!input.checked) {
                        showError(input, 'You must agree to the terms');
                        isValid = false;
                    }
                    break;
            }
        });

        if (isValid) {
            try {
                const formData = {
                    fullname: document.getElementById('fullname').value,
                    username: document.getElementById('username').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    password: document.getElementById('password').value
                };

                // Replace with your actual API endpoint
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Registration Successful!',
                        text: 'You can now login to your account.',
                        confirmButtonColor: '#3498db'
                    }).then(() => {
                        window.location.href = '/login';
                    });
                } else {
                    const data = await response.json();
                    throw new Error(data.message || 'Registration failed');
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Registration Failed',
                    text: error.message || 'Something went wrong. Please try again.',
                    confirmButtonColor: '#3498db'
                });
            }
        }
    });
});
