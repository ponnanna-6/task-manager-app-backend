const { authMiddleware } = require('../middlewares/auth');
const TaskModel = require('../schemas/task.schema');
const UserModel = require('../schemas/user.schema');
const express = require('express');

const router = express.Router()

router.post('/boards/share', authMiddleware, async (req, res) => {
    const ownerId = req.user;
    const { email } = req.body;

    try {

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const tasks = await TaskModel.find({ createdBy: ownerId });
        if (!tasks || tasks.length === 0) {
            return res.status(404).json({ message: 'No tasks found for this board owner' });
        }

        const tasksUpdated = [];
        for (let task of tasks) {
            if (!task.accessList.includes(user._id)) {
                task.accessList.push(user._id);
                tasksUpdated.push(task.save());
            }
        }

        await Promise.all(tasksUpdated);

        res.status(200).json({ message: 'Access granted to all tasks successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router