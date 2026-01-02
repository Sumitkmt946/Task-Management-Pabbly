const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Task = require('../models/tasks');


router.post('/task', async (req, res) => {
    try {
        const {
            title,
            description,
            assignTo,
            project,
            dueDate,
            priority
        } = req.body;

        const newTask = new Task({
            title,
            description,
            assignTo,
            project,
            dueDate,
            priority
        });

        await newTask.save();
        res.status(201).json({ message: 'Task added successfully' });
    } catch (error) {
        res.status(500).json({ message: error });
    }
});
// GET /tasks with optional pagination: ?page=1&limit=10
router.get('/tasks', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const total = await Task.countDocuments();
        const tasks = await Task.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
        res.json({ data: tasks, total, page, pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

// Summary: counts by status and priority
router.get('/tasks/summary', async (req, res) => {
    try {
        const total = await Task.countDocuments();
        const todo = await Task.countDocuments({ status: 'To-Do' });
        const inProgress = await Task.countDocuments({ status: 'In Progress' });
        const completed = await Task.countDocuments({ status: 'Completed' });

        const percent = (n) => (total === 0 ? 0 : Math.round((n / total) * 100));

        res.json({
            total,
            todo,
            inProgress,
            completed,
            percentTodo: percent(todo),
            percentInProgress: percent(inProgress),
            percentCompleted: percent(completed),
        });
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

// Get single task
router.get('/task/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

// Update task
router.put('/task/:id', async (req, res) => {
    try {
        const updates = (({ title, description, dueDate, priority, status }) => ({ title, description, dueDate, priority, status }))(req.body);
        const task = await Task.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json({ message: 'Task updated', data: task });
    } catch (error) {
        res.status(500).json({ message: error });
    }
});
// Delete task by id
router.delete('/task/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        const deleted = await Task.findByIdAndDelete(taskId);
        if (!deleted) return res.status(404).json({ message: 'Task not found' });
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error });
    }
});
module.exports = router