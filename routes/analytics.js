const express = require('express')
const router = express.Router()
const { authMiddleware } = require('../middlewares/auth')
const Task = require('../schemas/task.schema')


//get all tasks created by a user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const id = req.user;
        let query = {
            $or: [
                { createdBy: id },
                { accessList: id }
            ]
        };

        const priority = {
            "HIGH PRIORITY": 0,
            "MODERATE PRIORITY": 0,
            "LOW PRIORITY": 0,
            "DUE DATE": 0
        }

        const status = {
            "BACKLOG": 0,
            "TODO": 0,
            "IN PROGRESS": 0,
            "DONE": 0
        }

        const tasks = await Task.find(query).select('-__v');

        if (!tasks.length) {
            return res.status(400).json({ message: "Tasks not found" });
        }

        tasks.forEach(task => {
            priority[task.priority] += 1;
            status[task.taskStatus] += 1
        })

        tasks.forEach(task => {
            if (task.dueDate) {
                const dueDate = new Date(task.dueDate);
                if (dueDate < new Date()) {
                    priority["DUE DATE"] += 1
                }
            }
        })
        
        res.status(200).json({priority: priority, status: status});
    } catch (err) {
        res.status(400).json(err);
    }
});

module.exports = router