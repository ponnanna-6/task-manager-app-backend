const mongoose = require('mongoose')

const taskSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        required: true,
        enum : ["HIGH PRIORITY", "MODERATE PRIORITY", "LOW PRIORITY"]
    },
    assignedTo: {
        type: String,
        required: false
    },
    checklist: {
        type: [String],
        required: true
    },
    dueDate: {
        type: Date,
        required: false
    },
    taskStatus: {
        type: String,
        default: "TODO",
        enum : ["BACKLOG", "TODO", "IN PROGRESS", "DONE"]
    },
    accessList: {
        type: [mongoose.Schema.ObjectId],
        ref: "User",
        required: false
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