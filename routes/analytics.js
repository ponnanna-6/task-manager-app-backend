const express = require('express')
const router = express.Router()
const { authMiddleware } = require('../middlewares/auth')
const Task = require('../schemas/task.schema')
const Board = require('../schemas/board.schema')


//get all tasks created by a user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const id = req.user;

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

        const boards = await Board.find({
            $or: [
                { ownerId: id },
                { accessList: id }
            ]
        }).select('ownerId');

        if (!boards || boards.length === 0) {
            return res.status(404).json({ message: 'No boards found for this user' });
        }

        const ownerIds = boards.map(board => board.ownerId);

        const query = {
            $or: [
                { createdBy: { $in: ownerIds } }
            ]
        };

        const tasks = await Task.find(query).select('-__v');

        if (!tasks.length) {
            console.log("tasks not found")
            return res.status(400).json({ message: "Tasks not found" });
        }

        tasks.forEach(task => {
            priority[task.priority] += 1;
            status[task.taskStatus] += 1
        })

        tasks.forEach(task => {
            if (task.dueDate) {
                priority["DUE DATE"] += 1  
            }
        })
        
        res.status(200).json({priority: priority, status: status});
    } catch (err) {
        res.status(400).json(err);
    }
});

module.exports = router