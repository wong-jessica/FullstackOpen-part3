const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
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

beforeEach(async () => {
    await Note.deleteMany({})

    for(let i=0; i<initialNotes.length; i++) {
        let noteObject = new Note(initialNotes[i])
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
    expect(response.body.length).toBe(initialNotes.length)
})

test('a specific note is within the returned', async () => {
    const response = await api.get('/api/notes')
    const contents = response.body.map(r => r.content)
    expect(contents).toContain('Browser can execute only Javascript')
})

afterAll(() => {
    mongoose.connection.close()
})