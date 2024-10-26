const mongoose = require('mongoose')

const taskSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        required: true,
        enum: ["HIGH PRIORITY", "MODERATE PRIORITY", "LOW PRIORITY"]
    },
    assignedTo: {
        type: [{
            _id: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true
            },
            email: {
                type: String,
                required: true
            }
        }],
        required: false
    },
    checklist: {
        type: [{
            checked: {
                type: Boolean,
                required: true,
                default: false
            },
            message: {
                type: String,
                required: true
            }
        }],
        required: true
    },
    dueDate: {
        type: Date,
        required: false
    },
    taskStatus: {
        type: String,
        default: "TODO",
        enum: ["BACKLOG", "TODO", "IN PROGRESS", "DONE"]
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
})

const TaskModel = mongoose.model('Tasks', taskSchema)

module.exports = TaskModel