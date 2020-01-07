const Note = require('../models/note')

const initialNotes = [
    {
        content: 'HTML is easy',
        date: new Date(),
        important: false
    },
    {
        content: 'Browser can execute only Javascript',
        date: new Date(),
        important: true
    },
    {
        content: 'Reinitialize the test database before every test',
        date: new Date(),
        important: true
    },
    {
        content: 'With Jest, you can use beforeEach to set up the database before each test',
        date: new Date(),
        important: false
    }
]

const nonExistingId = async () => {
    const note = new Note({content: 'willremovethissoon'})
    await note.save()
    await note.remove()

    return note._id.toString()
}

const notesInDb = async () => {
    const notes = await Note.find({})
    return notes.map(note => note.toJSON())
}

module.exports = {
    initialNotes, nonExistingId, notesInDb
}