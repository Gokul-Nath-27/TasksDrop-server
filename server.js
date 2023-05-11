const express = require('express')
const dotenv = require('dotenv').config()
const path = require('path')

const port = process.env.PORT || 3500
const app = express()

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

app.listen(port, () => console.log(`Server started with a port ${port}`))

 