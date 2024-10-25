const express = require('express')
const router = express.Router()
const { authMiddleware } = require('../middlewares/auth')
const Task = require('../schemas/task.schema')

//Add task route
router.post('/add', authMiddleware, async (req, res) => {
    try {
        const id = req.user
        const { title, priority, assignedTo, checklist, dueDate } = req.body;

        if (!title || !priority || !checklist) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }
        const newTask = new Task({ title, priority, assignedTo, checklist, dueDate, createdBy: id });
        await newTask.save();
        return res.status(200).json({ message: "Task created successfully!" });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "An error occurred. Please try again later.", error: error });
    }
});

//get all tasks created by a user
router.get('/user', authMiddleware, async (req, res) => {
    try {
        const id = req.user;
        const { filter } = req.query;

        const today = new Date();
        let startDate, endDate;

        if (filter === 'week') {
            // Set start of the week (Monday) and end of the week (Sunday)
            const dayOfWeek = today.getDay();
            const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust when day is Sunday
            startDate = new Date(today.setDate(diff)); // Start of the week
            startDate.setHours(0, 0, 0, 0); // Set start time to 00:00:00
            endDate = new Date(today.setDate(startDate.getDate() + 6)); // End of the week
            endDate.setHours(23, 59, 59, 999); // Set end time to 23:59:59
        } else if (filter === 'month') {
            // Set start of the month and end of the month
            startDate = new Date(today.getFullYear(), today.getMonth(), 1); // First day of the month
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of the month
            endDate.setHours(23, 59, 59, 999);
        } else if (filter === 'today') {
            // Set start and end to today
            startDate = new Date(today);
            startDate.setHours(0, 0, 0, 0); // Set start time to 00:00:00
            endDate = new Date(today);
            endDate.setHours(23, 59, 59, 999); // Set end time to 23:59:59
        }

        let query = {
            $or: [
                { createdBy: id },
                { accessList: id }
            ]
        };

        if (filter === 'week' || filter === 'month' || filter === 'today') {
            query = {
                ...query,
                $or: [
                    { dueDate: { $exists: false } },
                    { dueDate: "" },
                    { dueDate: { $gte: startDate, $lte: endDate } }
                ],
                $or: [
                    { createdBy: id },
                    { accessList: id }
                ]
            };
        }

        const tasks = await Task.find(query).select('-__v');


        if (!tasks.length) {
            return res.status(400).json({ message: "Tasks not found" });
        }

        res.status(200).json(tasks);
    } catch (err) {
        res.status(400).json(err);
    }
});


//creeate a function to get task data by id
router.get('/id/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params
        const tasks = await Task.find({ _id: id }).select('-__v');
        if (!tasks.length) {
            return res.status(400).json({ message: "Task not found" });
        }
        res.status(200).json(tasks[0]);
    } catch (err) {
        res.status(400).json(err);
    }
});

//update task
router.put('/edit/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { title, priority, assignedTo, checklist, dueDate, taskStatus } = req.body;
        if (!title || !priority || !checklist) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }
        await Task.findByIdAndUpdate(id, { title, priority, assignedTo, checklist, dueDate, taskStatus }, { new: false })
        return res.status(200).json({ message: "Task updated successfully!" });
    } catch (err) {
        res.status(400).json(err);
    }
})

//delete task   
router.delete('/delete/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params
        await Task.findByIdAndDelete(id)
        return res.status(200).json({ message: "Task deleted successfully!" });
    } catch (err) {
        res.status(400).json(err);
    }
});

//update task status
router.put('/status/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { taskStatus } = req.body;
        await Task.findByIdAndUpdate(id, { taskStatus }, { new: false })
        return res.status(200).json({ message: "Task status updated successfully!" });
    } catch (err) {
        res.status(400).json(err);
    }
})

//update checkList
router.put('/checkList/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { checklist } = req.body;
        
        if (!checklist) {
            return res.status(400).json({ message: "Checklist is required" });
        }
        await Task.findByIdAndUpdate(id, { checklist }, { new: false })
        return res.status(200).json({ message: "Checklist updated successfully!" });
    } catch (err) {
        res.status(400).json(err);
    }
})

module.exports = router