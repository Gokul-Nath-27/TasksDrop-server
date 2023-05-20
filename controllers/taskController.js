const User = require('../models/userModel')
const Task = require('../models/taskModel')
const asyncHandler = require('express-async-handler')

// @desc Get all tasks
// @route GET /tasks
// @access Private
const getAllTasks = asyncHandler( async (req, res) => {
    const tasks = await Task.find().lean()

    if(!tasks.length) return res.status(400).json({message: 'No Tasks found📝'})

    // Add username to each task before sending the response 
    const tasksWithUser = await Promise.all(tasks.map(async (task) => {
        const user = await User.findById(task.user).lean().exec()
        return { ...task, username: user.username }
    }))

    res.json(tasks)
})


// @desc Create a task
// @route POST /tasks
// @access Private
const createNewTask = asyncHandler( async (req, res) => {
    const { user, title, text, } = req.body 

    // Confirm data which we got
    if(!user || !title || !text ){
        return res.status(400).json({message: 'All fields are required😒'})
    }

    // Check for duplicate title
    const duplicateTitle = await Task.findOne({title})
    if(duplicateTitle){
        return res.status(409).json({message: "Task title assigned already!🤡"})
    }

    // Create and storing the task
    const task = await Task.create({user, title, text}).exec()

    if(task){
        return res.status(201).json({message: "Task created Successfully🎯"})
    } else{
        return res.status(400).json({message: "Invalid Task data!💩"})
    }

})


// @desc Update a task
// @route PATCH /tasks
// @access Private

const updateTask = asyncHandler( async (req, res) => {
    const { id, user, title, text, completed }  = req.body 

    // Confirm data which we got
    if(!id || !user || !title || !text || typeof completed !== 'boolean'){
        return res.status(400).json({message: "All fields are required😒"})
    }

    // Check for the task exists
    const task = await Task.findById(id).exec()

    if(!task){
        return res.status(400).json({message: 'Task not found!💀'})
    }

    // Check for duplicate title
    const duplicate = await Task.findOne({title}).lean().exec()

    // Allow renaming of the original task 
    if(duplicate?._id.toString() !== id){
        return res.status(409).json({message: 'Task Conflicts👀'})
    }

    task.user = user
    task.title = title
    task.text = text
    task.completed = completed

    // Updating the Task in db
    const updatedTask = await task.save()
    res.json({message: `'${updatedTask.title}' updated😎`})
})

const deleteTask = asyncHandler(async (req, res) => {
    const { id } = req.body

    if(!id) return res.status(400).json({message: "ID is required👾"})

    // Confirm task exists to delete 
    const task = await Task.findById(id).exec()

    if(!task) return res.status(400).json({message: "Task not found🛸"})

    // Deleting the task 
    const deleteTask = await task.deleteOne()

    res.json(`Task ${deleteTask.title} has been deleted🪁`)
})

module.exports = { 
    getAllTasks,
    createNewTask,
    updateTask,
    deleteTask
}