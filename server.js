const express = require('express')
const dotenv = require('dotenv').config()
const path = require('node:path');
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { logger } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const corsOptions = require('./config/corsOptions')

const port = process.env.PORT || 3500
const app = express()

app.use(logger)
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use('/', express.static(path.join(__dirname, 'public')))
app.use('/', require('./routes/root'))

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
app.listen(port, () => console.log(`Server started with a port ${port}`))

 