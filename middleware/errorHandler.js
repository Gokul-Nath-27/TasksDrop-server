const { logEvent } = require('./logger')

const errorHandler = (err, req, res, next) => {
    logEvent(`${err.name}\t${err.message}\t${req.headers.origin}`, 'errorLog.log')
    console.log(err.message)

    const statusCode = res.statusCode || 500
    res.status(statusCode)
    res.json({message: err.message})
}

module.exports = errorHandler