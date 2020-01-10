const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const route = require('express').Router()
const User = require('../models/user')

route.post('/', async (req, res) => {
    const body = req.body

    const user = await User.findOne({username: body.username})
    const passwordOK = user === null ?
        false
        : await bcrypt.compare(body.password, user.passwordHash)

    if(!(user && passwordOK)) {
        return res.status(401).json({
            error: 'invalid username or password'
        })
    }

    const userForToken = {
        username: user.username,
        id: user._id
    }

    const token = jwt.sign(userForToken, process.env.SECRET)

    res
        .status(200)
        .send({token, username: user.username, name: user.name})
})

module.exports = route