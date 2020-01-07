const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper.js')
const app = require('../app')
const api = supertest(app)

const Note = require('../models/note.js')

beforeEach(async () => {
    await Note.deleteMany({})

    for(let i=0; i<helper.initialNotes.length; i++) {
        let noteObject = new Note(helper.initialNotes[i])
        await noteObject.save()
    }
})

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

test('valid note is correctly added', async () => {
    const newNote = {
        content: 'async/await simplifies async calls',
        important: false
    }

    await api
        .post('/api/notes')
        .send(newNote)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/notes')
    const contents = response.body.map(r => r.content)

    expect(response.body.length).toBe(helper.initialNotes.length + 1)
    expect(contents).toContain(
        'async/await simplifies async calls'
    )
})

test('note without content is not added', async () => {
    const newNote = {
        important: true
    }

    await api
        .post('/api/notes')
        .send(newNote)

    const response = await api.get('/api/notes')

    expect(response.body.length).toBe(helper.initialNotes.length)
})

test('get a specific note by id', async () => {
    const notesAtStart = await helper.notesInDb()
    const noteToView = notesAtStart[0]

    const resultNote = await api
        .get(`/api/notes/${noteToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    expect(resultNote.body).toEqual(noteToView)
})

test('update specific note', async () => {
    const notes = await helper.notesInDb()
    const updatedNote = notes[0]
    updatedNote.content = 'This is updated'

    const resultNote = await api
        .put(`/api/notes/${notes[0].id}`)
        .send(updatedNote)
    expect(resultNote.body.content).toBe('This is updated')


})

test('delete a note', async () => {
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

afterAll(() => {
    mongoose.connection.close()
})