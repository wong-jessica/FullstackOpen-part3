const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper.js')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')

describe('db initially has one user', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        const user = new User({username:'root', password:'password'})
        await user.save()
    })

    test('creation succeeds with unique username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username:'jessikw',
            name:'Jessica Wong',
            password:'password',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd.length).toBe(usersAtStart.length+1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('creation fails if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            user:'root',
            name:'Tester',
            password:'password'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('`username` to be unique')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd.length).toBe(usersAtStart.length)
    })
})

afterAll(() => {
    mongoose.connection.close()
})