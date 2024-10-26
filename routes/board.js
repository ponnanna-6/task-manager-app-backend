const { authMiddleware } = require('../middlewares/auth');
const UserModel = require('../schemas/user.schema');
const BoardModel = require('../schemas/board.schema');
const express = require('express');

const router = express.Router()

router.get('/', authMiddleware, async (req, res) => {
    const ownerId = req.user;

    try {
        const user = await UserModel.findById(ownerId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const board = await BoardModel.findOne({ ownerId });
        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }
        res.status(200).json(board);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router