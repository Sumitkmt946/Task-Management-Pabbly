const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// setup multer for avatar uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, `avatar_${Date.now()}${ext}`);
    }
});
const upload = multer({ storage });

router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create a new user
        const newUser = new User({ firstName, lastName, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

// Get current logged-in user
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId || req.user.id || req.user;
        const user = await User.findById(userId).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

// Update current logged-in user profile
router.patch('/me', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId || req.user.id || req.user;
        const { firstName, lastName, email } = req.body;
        const update = {};
        if (firstName !== undefined) update.firstName = firstName;
        if (lastName !== undefined) update.lastName = lastName;
        if (email !== undefined) update.email = email;

        const updated = await User.findByIdAndUpdate(userId, { $set: update }, { new: true }).select('-password');
        if (!updated) return res.status(404).json({ message: 'User not found' });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

// Upload avatar image
router.post('/me/avatar', authMiddleware, upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
        const userId = req.user.userId || req.user.id || req.user;
        const avatarPath = `/uploads/${req.file.filename}`;
        const updated = await User.findByIdAndUpdate(userId, { $set: { avatar: avatarPath } }, { new: true }).select('-password');
        if (!updated) return res.status(404).json({ message: 'User not found' });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message || error });
    }
});
module.exports = router;
