const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Serve static files from specific directories
app.use('/profile', express.static(path.join(__dirname, 'profile')));
app.use('/registration', express.static(path.join(__dirname, 'registration')));
app.use('/listings', express.static(path.join(__dirname, 'real estate listing')));

// Basic routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'registration', 'index.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'profile', 'index.html'));
});

// Simple response for API routes
app.post('/api/auth/register', (req, res) => {
    res.json({ message: 'Registration endpoint (Database disabled)' });
});

app.post('/api/auth/login', (req, res) => {
    res.json({ message: 'Login endpoint (Database disabled)' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
