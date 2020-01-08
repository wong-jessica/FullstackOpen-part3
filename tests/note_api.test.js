const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper.js')
const app = require('../app')
const api = supertest(app)

const Note = require('../models/note.js')

beforeEach(async () => {
    await Note.deleteMany({})

    const noteObject = helper.initialNotes.map(note => new Note(note))
    const promiseArray = noteObject.map(note => note.save())
    await Promise.all(promiseArray)
})

describe('database initially has notes saved', () => {
    test('notes are returned as json', async () => {
        await api
            .get('/api/notes')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all notes are returned', async () => {
        const response = await api.get('/api/notes')
        expect(response.body.length).toBe(helper.initialNotes.length)
    })

    test('a specific note is within the returned', async () => {
        const response = await api.get('/api/notes')
        const contents = response.body.map(r => r.content)
        expect(contents).toContain('Browser can execute only Javascript')
    })
})

describe('view a specific note', () => {
    test('succeeds with a valid id', async () => {
        const notesAtStart = await helper.notesInDb()
        const noteToView = notesAtStart[0]

        const resultNote = await api
            .get(`/api/notes/${noteToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        expect(resultNote.body.content).toEqual(noteToView.content)
        expect(resultNote.body.date).toEqual(noteToView.date.toJSON())
        expect(resultNote.body.id).toEqual(noteToView.id)
        expect(resultNote.body.important).toEqual(noteToView.important)
    })

    test('fails with `404` when note does not exist', async () => {
        const validNonexistingId = await helper.nonExistingId()

        await api
            .get(`/api/notes/${validNonexistingId}`)
            .expect(404)
    })

    test('fails with `400` when id is invalid or of the wrong form', async () => {
        const invalidId = Date.now()

        await api
            .get(`/api/notes/${invalidId}`)
            .expect(400)
    })
})

describe('adding a new note', () => {
    test('succeeds when note is valid', async () => {
        const newNote = {
            content: 'async/await simplifies async calls',
            important: false
        }

        await api
            .post('/api/notes')
            .send(newNote)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/notes')
        const contents = response.body.map(r => r.content)

        expect(response.body.length).toBe(helper.initialNotes.length + 1)
        expect(contents).toContain(
            'async/await simplifies async calls'
        )
    })

    test('fails with `400` when note has invalid data', async () => {
        const newNote = {
            important: true
        }

        await api
            .post('/api/notes')
            .send(newNote)
            .expect(400)

        const response = await api.get('/api/notes')

        expect(response.body.length).toBe(helper.initialNotes.length)
    })
})

describe('update a specific note', () => {
    test('succeeds when data is valid', async () => {
        const notes = await helper.notesInDb()
        const updatedNote = notes[0]
        updatedNote.content = 'This is updated'

        const resultNote = await api
            .put(`/api/notes/${notes[0].id}`)
            .send(updatedNote)
        expect(resultNote.body.content).toBe('This is updated')
    })
})

describe('delete a note', () => {
    test('succeeds with `204` when id is valid', async () => {
        const notesAtStart = await helper.notesInDb()
        const noteToDelete = notesAtStart[0]

        await api
            .delete(`/api/notes/${noteToDelete.id}`)
            .expect(204)

        const notesAtEnd = await helper.notesInDb()

        expect(notesAtEnd.length).toBe(notesAtStart.length-1)

        const contents = notesAtEnd.map(r => r.content)
        expect(contents).not.toContain(noteToDelete.content)
    })
})


afterAll(() => {
    mongoose.connection.close()
})