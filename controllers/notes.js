const route = require('express').Router()
const Note = require('../models/note')

route.get('/', (req, res) => {
    Note.find({}).then(notes => {
        res.json(notes.map(note => note.toJSON()))
    })
})

route.get('/:id', (req, res, next) => {
    Note.findById(req.params.id)
        .then(note => {
            if(note) {
                res.json(note.toJSON())
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

route.post('/', (req, res, next) => {
    const body = req.body

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
    })
    note.save()
        .then(savedNote => {
            res.json(savedNote.toJSON())
        })
        .catch(error => next(error))
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

route.delete('/:id', (req, res, next) => {
    Note.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

module.exports = route