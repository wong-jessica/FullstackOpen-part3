const bcrypt = require('bcrypt')
const route = require('express').Router()
const User = require('../models/user')

route.get('/', async (req, res) => {
    const users = await User
        .find({}).populate('notes', {content:1, date:1})
    res.json(users.map(u => u.toJSON()))
})

route.post('/', async (req, res, next) => {
    try {
        const body = req.body

        const saltRounds = 10
        const passwordHash = await bcrypt.hash(body.password, saltRounds)

        const user = new User({
            username: body.username,
            name: body.name,
            passwordHash,
        })

        const savedUser = await user.save()
        res.json(savedUser)
    } catch(error) {
        next(error)
    }
})

module.exports = route