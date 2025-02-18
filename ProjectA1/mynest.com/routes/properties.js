const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const auth = require('../middleware/auth');
const multer = require('multer');

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb) {
        cb(null, 'property-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Get all properties
router.get('/', async (req, res) => {
    try {
        const properties = await Property.find()
            .populate('owner', 'name email')
            .sort('-createdAt');
        res.json(properties);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get property by ID
router.get('/:id', async (req, res) => {
    try {
        const property = await Property.findById(req.params.id)
            .populate('owner', 'name email');
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }
        res.json(property);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create property
router.post('/', auth, upload.array('images', 5), async (req, res) => {
    try {
        const { title, type, price, location, description, features } = req.body;
        
        const images = req.files.map(file => `/uploads/${file.filename}`);
        
        const property = new Property({
            title,
            type,
            price,
            location,
            description,
            features: features ? features.split(',') : [],
            images,
            owner: req.user.id
        });

        await property.save();
        res.status(201).json(property);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update property
router.put('/:id', auth, async (req, res) => {
    try {
        let property = await Property.findById(req.params.id);
        
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Verify owner
        if (property.owner.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        property = await Property.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        res.json(property);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete property
router.delete('/:id', auth, async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Verify owner
        if (property.owner.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await property.remove();
        res.json({ message: 'Property removed' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
