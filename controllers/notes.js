const route = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')

route.get('/', async (req, res) => {
    const notes = await Note
        .find({}).populate('user', {username:1, name:1})
    res.json(notes.map(note => note.toJSON()))
})

route.get('/:id', async (req, res, next) => {
    try {
        const note = await Note.findById(req.params.id)
        if(note) {
            res.json(note.toJSON())
        } else {
            res.status(404).end()
        }
    } catch(error) {
        next(error)
    }
})

route.post('/', async (req, res, next) => {
    const body = req.body

    const user = await User.findById(body.userId)

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
        user: user._id
    })

    try {
        const savedNote = await note.save()
        user.notes = user.notes.concat(savedNote._id)
        await user.save()
        res.json(savedNote.toJSON())
    } catch(error) {
        next(error)
    }
})

route.put('/:id', (req, res, next) => {
    const body = req.body

    const updatedNote = {
        content: body.content,
        important: body.important
    }

    Note.findByIdAndUpdate(req.params.id, updatedNote, {new: true})
        .then(updatedNote => {
            res.json(updatedNote.toJSON())
        })
        .catch(error => next(error))
})

route.delete('/:id', async (req, res, next) => {
    try {
        await Note.findByIdAndRemove(req.params.id)
        res.status(204).end()
    } catch(error) {
        next(error)
    }
})

module.exports = route