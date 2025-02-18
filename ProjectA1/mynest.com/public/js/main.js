// DOM Elements
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');
const propertyGrid = document.getElementById('featuredProperties');
const searchInput = document.querySelector('.search-container input');
const searchBtn = document.querySelector('.search-btn');
const typeCards = document.querySelectorAll('.type-card');

// API Base URL
const API_URL = '/api';

// Check if user is logged in
const token = localStorage.getItem('token');
if (token) {
    updateAuthUI(true);
}

// Mobile Menu Toggle
mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('show');
});

// Property Type Card Click Handlers
typeCards.forEach(card => {
    card.addEventListener('click', () => {
        const propertyType = card.dataset.type;
        window.location.href = `/properties?type=${propertyType}`;
    });
});

// Search Handler
searchBtn.addEventListener('click', () => {
    const searchQuery = searchInput.value.trim();
    if (searchQuery) {
        window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
});

// Enter key search
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

// Load Featured Properties
async function loadFeaturedProperties() {
    try {
        const response = await fetch(`${API_URL}/properties?featured=true`);
        const properties = await response.json();
        
        propertyGrid.innerHTML = properties.map(property => `
            <div class="property-card">
                <div class="property-image">
                    <img src="${property.images[0]}" alt="${property.title}">
                    <span class="property-type">${property.type}</span>
                </div>
                <div class="property-content">
                    <h3>${property.title}</h3>
                    <p class="location"><i class='bx bxs-map'></i> ${property.location}</p>
                    <p class="price">₹${property.price.toLocaleString()}</p>
                    <div class="property-features">
                        ${property.features.slice(0, 3).map(feature => 
                            `<span><i class='bx bx-check'></i> ${feature}</span>`
                        ).join('')}
                    </div>
                    <a href="/property/${property._id}" class="view-details">View Details</a>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading featured properties:', error);
    }
}

// Update Auth UI
function updateAuthUI(isLoggedIn) {
    const authButtons = document.getElementById('authButtons');
    
    if (isLoggedIn) {
        authButtons.innerHTML = `
            <a href="/profile" class="profile-btn">
                <i class='bx bx-user-circle'></i> Profile
            </a>
            <a href="#" class="logout-btn" onclick="logout()">Logout</a>
        `;
    } else {
        authButtons.innerHTML = `
            <a href="/login" class="login-btn">
                <i class='bx bx-user'></i> Login
            </a>
            <a href="/register" class="register-btn">Register</a>
        `;
    }
}

// Logout Function
function logout() {
    localStorage.removeItem('token');
    updateAuthUI(false);
    window.location.href = '/';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedProperties();
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add animation on scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
});

document.querySelectorAll('.type-card, .property-card').forEach((el) => observer.observe(el));
