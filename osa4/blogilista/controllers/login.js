const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body

    const user = await User.findOne({ username })

    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'Invalid username or password'
        })
    }

    const userPayload = {
        username: user.username,
        id: user._id,
    }

    const token = jwt.sign(userPayload, process.env.SECRET, { expiresIn: 60 * 60 })

    const userResponse = {
        token,
        username: user.username,
        name: user.name
    }

    response.status(200).send(userResponse)
})

module.exports = loginRouter
