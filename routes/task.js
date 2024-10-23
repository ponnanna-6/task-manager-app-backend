const express = require('express')
const router = express.Router()
const { authMiddleware } = require('../middlewares/auth')
const Task = require('../schemas/task.schema')

//Add task route
router.post('/add', authMiddleware, async (req, res) => {
    try {
        const id = req.user
        const {title, priority, assignedTo, checklist, dueDate} = req.body;

        if(!title || !priority || !checklist){
            return res.status(400).json({message: "Please fill all the fields"});
        }
        const newTask = new Task({title, priority, assignedTo, checklist, dueDate, createdBy: id});
        await newTask.save();
        return res.status(200).json({ message: "Task created successfully!" });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "An error occurred. Please try again later.", error: error});
    }
});

//get all tasks created by a user
router.get('/user', authMiddleware, async (req, res) => {
    try {
        const id = req.user
        const tasks = await Task.find({createdBy : id}).select('-__v');
        if(!tasks.length){
            return res.status(400).json({message:"Tasks not found"});
        }
        res.status(200).json(tasks);
    } catch (err) {
        res.status(400).json(err);
    }
});

//creeate a function to get task data by id
router.get('/id/:id', authMiddleware, async (req, res) => {
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

//update task
router.put('/edit/:id', async (req, res)=>{
    try {
        const {id} = req.params
        const {title, priority, assignedTo, checklist, dueDate, taskStatus} = req.body;   
        if(!title || !priority || !checklist){
            return res.status(400).json({message: "Please fill all the fields"});
        }     
        await Task.findByIdAndUpdate(id, {title, priority, assignedTo, checklist, dueDate, taskStatus}, {new: false})
        return res.status(200).json({ message: "Task updated successfully!" });
    } catch (err) {
        res.status(400).json(err);
    }
})

//delete task   
router.delete('/delete/:id', authMiddleware, async (req, res) => {
    try {   
        const {id} = req.params
        await Task.findByIdAndDelete(id)
        return res.status(200).json({ message: "Task deleted successfully!" });
    } catch (err) {
        res.status(400).json(err);
    }
});

//update task status
router.put('/status/:id', async (req, res)=>{
    try {
        const {id} = req.params
        const {taskStatus} = req.body;  
        console.log(req.body) 
        console.log(taskStatus, id)
        if(!taskStatus){
            return res.status(400).json({message: "Please fill all the fields"});
        }     
        await Task.findByIdAndUpdate(id, {taskStatus}, {new: false})
        return res.status(200).json({ message: "Task status updated successfully!" });
    } catch (err) {
        res.status(400).json(err);
    }
})

module.exports = router