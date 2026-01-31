const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    title: {
        type: String,
    },
    description: {
        type: String,
        required: true,
    },
    clientName: {
        type: String,
    },
    startDate: {
        type: Date,
    },
    deadline: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed', 'On Hold', 'Testing'],
        default: 'Pending',
    },
    priority: {
        type: String,
        enum: ['High', 'Medium', 'Low', 'Most Important', 'Important', 'Least Important'],
        default: 'Medium',
    },
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    tasksCount: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Project', projectSchema);
