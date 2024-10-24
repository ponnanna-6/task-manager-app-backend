const express = require('express')
const router = express.Router()
const Task = require('../schemas/task.schema')


router.get('/task/:id', async (req, res) => {
    try {
        const {id} = req.params
        const tasks = await Task.find({_id : id}).select('-__v');
        if(!tasks.length){
            return res.status(400).json({message:"Task not found"});
        }
        res.status(200).json(tasks[0]);    
    } catch (err) {
        res.status(400).json(err);
    }
});

module.exports = router