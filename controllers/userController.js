const User = require('../models/userModel')
const Task = require('../models/taskModel')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler( async (req, res) => {
    const users = await User.find().select('-password').lean()

    if(!users.length) return res.status(400).json({message: 'No users found🙄'})

    res.json(users)
})

// @desc Create a user
// @route POST /users
// @access Private
const createNewUser = asyncHandler( async (req, res) => {
    const { username, password, roles } = req.body 

    // Confirm data which we got
    if(!username || !password || !Array.isArray(roles) || !roles.length){
        return res.status(400).json({message: 'All fields are required😒'})
    }

    // Cheking for duplicates
    const duplicate = await User.findOne({username}).lean().exec() // .lean() will convert mongoDB returned document which has all the methods associated with it, to basic json object.
    if(duplicate) return res.status(409).json({message: 'Username Already Exits!😔'})

    // hashing the Password
    const hashedPwd = await bcrypt.hash(password, 10) // 10 -> which is salt

    const userObject = { username, password: hashedPwd, roles}

    // Create and store the object
    const user = await User.create(userObject)

    if(user){
        res.status(201).json({message: `New user ${username} created😌`})
    } else {
        res.status(400).json({message: 'Invalid user data recieved💀'})
    }

})

// @desc Update user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler( async (req, res) => {
    const { id, username, roles, jobStatus, password } = req.body 

    // Confirm data which we got
    if(!id || !username || !Array.isArray(roles) || !roles.length || typeof jobStatus !== 'boolean'){
        return res.status(400).json({message: 'All fields are required😒'})
    }
    
    // we are using exec() method because we querying by the value 'id'. exec will return a PROMISE
    const user = await User.findById(id).exec()

    if(!user) return res.status(400).json({message: 'User not found🛸'})

    // Cheking for duplicates
    const duplicate = await User.findOne({ username }).select('-password').lean().exec()

    // Allow updates to the original user
    if(duplicate?._id.toString() !== id){
        return res.status(409).json({message: 'Username Conflict👀'})
    } 

    user.username = username
    user.roles = roles
    user.jobStatus = jobStatus

    // if the user wants to update the password too then this will run
    if(password){
        // Hashing the Password
        user.password = await bcrypt.hash(password, 10) // 10 -> which is salt
    }

    // if we have used lean() method in line 60, then we wouldn't be able to access the save() method below.
    const updatedUser = await user.save()

    res.json({message: `${updatedUser.username} updated😎`})
})

// @desc Delete user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler( async (req, res) => {

    const { id } = req.body
    
    if(!id) return res.status(400).json({message: 'ID is required👾'})

    // if the user is assigned with some tasks then we don't want to delete the user.
    const task = await Task.findOne({user: id}).lean().exec()

    if(task){
        return res.status(400).json({message: 'User has assigned tasks 🐱‍👤'})
    }

    const user = await User.findById(id).exec()
    
    if(!user) {
        return res.status(400).json({message: 'User not found🛸'})
    }

    const deleteResult = await user.deleteOne()

    res.json({message: `User ${deleteResult.username} with ID ${deleteResult._id} deleted ⚰`})
})

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}