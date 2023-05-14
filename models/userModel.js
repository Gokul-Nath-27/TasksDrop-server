const { model, Schema } = require("mongoose");

const userSchema = Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: [{
        type: String,
        default: "Employee"
    }],
    jobStatus: {
        type: Boolean,
        default: true
    }
})

module.exports = model('User', userSchema)