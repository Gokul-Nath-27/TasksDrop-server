const express = require("express")
const router = express.Router()
const { getAllTasks, createNewTask, deleteTask, updateTask } = require('../controllers/taskController')

router.route('/')
    .get(getAllTasks)
    .post(createNewTask)
    .patch(updateTask)
    .delete(deleteTask)

module.exports = router