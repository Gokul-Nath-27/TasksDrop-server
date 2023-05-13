const allowedOrigin = [
    'http://localhost:5000',
    'https://www.google.com'
]

const corsOptions = {
    origin: (origin, callback) => {
        if(allowedOrigin.indexOf(origin) !== -1 || !origin){
            callback(null, true) //null -> err object, true -> origin allowed
        }
        else{
            callback(new Error('Not allowed by CORS '))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200 || 204
}

module.exports = corsOptions