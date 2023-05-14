const express = require('express')
const path = require('node:path');
const cors = require('cors')
const cookieParser = require('cookie-parser')
const errorHandler = require('./middleware/errorHandler')
const { logger, logEvent } = require('./middleware/logger')
const corsOptions = require('./config/corsOptions');
const mongoose = require('mongoose');
require('dotenv').config()
const app = express()

// Function call to connect mongoDB database
require('./config/dbConn')()

const port = process.env.PORT || 3500
console.log(process.env.NODE_ENV)

// Middleware to the application
app.use(logger)

app.use(cors(corsOptions))

app.use(express.json())

app.use(cookieParser())

// Routing in the application goes here.

app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/root'))

app.use('/users', require('./routes/userRoute'))

// Wrong Route Handling

app.all('*', (req, res) => {
    res.status(404)
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if(req.accepts('json')){
        res.json({message: '404 Not found'})
    } else{
        res.type('txt').send('404 NotFound')
    } 
})

app.use(errorHandler)

// Connect to MongoDB and Starting up the server

mongoose.connection.once('open', () => {
    app.listen(port, () => console.log(`Server started with a port ${port}`))
})

mongoose.connection.on('error', (err) => {
    logEvent(`${err.errno}\t${err.code}\t${err.hostname}\t${err.syscall}`, 'mongoErrLog.log')
})
