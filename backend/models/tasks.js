const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    assignTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: false,
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: false,
    },
    startDate: {
        type: Date,
        required: false,
    },
    priority: {
        type: String,
        enum: ['Most Important', 'Important', 'Least Important'],
        required: true,
    },
    status: {
        type: String,
        enum: ['To-Do', 'In Progress', 'Completed'],
        required: false,
        default: 'To-Do'
    },
    dueDate: {
        type: Date,
        required: false,
    },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
