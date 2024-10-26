const { authMiddleware } = require('../middlewares/auth');
const TaskModel = require('../schemas/task.schema');
const UserModel = require('../schemas/user.schema');
const BoardModel = require('../schemas/board.schema');
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

        const board = await BoardModel.findOne({ ownerId });
        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }
        if (board.accessList.includes(user._id)) {
            return res.status(400).json({ message: 'User already has access to the board' });
        }
        await BoardModel.findByIdAndUpdate(
            board._id, 
            { 
                $push: { 
                    accessList: user._id, 
                    emailList: email 
                }
            }, 
            { new: true }
        );
        res.status(200).json({ message: 'Board access granted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router