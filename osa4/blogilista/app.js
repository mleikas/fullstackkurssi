const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const mongoose = require('mongoose')

logger.info('connecting to', config.MONGODB_URI)
mongoose.set('strictQuery', false);
mongoose.connect(config.MONGODB_URI, { dbName: 'blogs', useNewUrlParser: true, useUnifiedTopology: true }, function (error) {
    if (error) {
        console.log(error);
    } else {
        logger.info('Connected to MongoDB');
    }
});

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app