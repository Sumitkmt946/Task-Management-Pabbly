const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const TeamMember = require('../models/teamMembers');

// Get all team members
router.get('/team', async (req, res) => {
    try {
        const members = await TeamMember.find().sort({ createdAt: -1 });
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single team member
router.get('/team/:id', async (req, res) => {
    try {
        const member = await TeamMember.findById(req.params.id);
        if (!member) {
            return res.status(404).json({ message: 'Team member not found' });
        }
        res.json(member);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create team member
router.post('/team', async (req, res) => {
    try {
        const newMember = new TeamMember(req.body);
        await newMember.save();
        res.status(201).json({ message: 'Team member added successfully', member: newMember });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(500).json({ message: error.message });
    }
});

// Update team member
router.put('/team/:id', async (req, res) => {
    try {
        const member = await TeamMember.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!member) {
            return res.status(404).json({ message: 'Team member not found' });
        }
        res.json({ message: 'Team member updated successfully', member });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete team member
router.delete('/team/:id', async (req, res) => {
    try {
        const member = await TeamMember.findByIdAndDelete(req.params.id);
        if (!member) {
            return res.status(404).json({ message: 'Team member not found' });
        }
        res.json({ message: 'Team member removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
