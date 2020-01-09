const config = require('./utils/config')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const noteRoute = require('./controllers/notes.js')
const userRoute = require('./controllers/users.js')
const middleware = require('./utils/middleware.js')
const logger = require('./utils/logger.js')
const mongoose = require('mongoose')

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch(error => {
        logger.info('error connecting to MongoDB', error.message)
    })

app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())
app.use(middleware.requestLogger)

app.use('/api/notes', noteRoute) // routes that start with /api/notes will be redirected to route
app.use('/api/users', userRoute)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app

