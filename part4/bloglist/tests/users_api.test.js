const supertest = require('supertest')
const mongoose = require('mongoose')
const testHelper = require('./test_helper')
const testResources = require('./test_resources')
const app = require('../app')

const api = supertest(app)
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})
  await User.insertMany(testResources.initialUsers)
})

describe('user registration', () => {
  test('creation fails if username is missing', async () => {
    const newUser = {
      name: 'Mariano Guillaume',
      password: 'password'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username and password are required')

    const usersAtEnd = await testHelper.usersInDb()
    expect(usersAtEnd).toHaveLength(testResources.initialUsers.length)
  }, 100000)

  test('creation fails if password is missing', async () => {
    const newUser = {
      username: 'marianoguillaume',
      name: 'Mariano Guillaume'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username and password are required')

    const usersAtEnd = await testHelper.usersInDb()
    expect(usersAtEnd).toHaveLength(testResources.initialUsers.length)
  })

  test('creation fails if username is shorter than 3 characters', async () => {
    const newUser = {
      username: 'ma',
      name: 'Mariano Guillaume',
      password: 'password'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain(
      'username and password must be at least 3 characters long'
    )

    const usersAtEnd = await testHelper.usersInDb()
    expect(usersAtEnd).toHaveLength(testResources.initialUsers.length)
  })

  test('creation fails if password is shorter than 3 characters', async () => {
    const newUser = {
      username: 'marianoguillaume',
      name: 'Mariano Guillaume',
      password: 'pa'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain(
      'username and password must be at least 3 characters long'
    )

    const usersAtEnd = await testHelper.usersInDb()
    expect(usersAtEnd).toHaveLength(testResources.initialUsers.length)
  })

  test('creation fails if username is already in use', async () => {
    const newUser = {
      username: 'hellas',
      name: 'Arto Hellas',
      password: 'password'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username must be unique')

    const usersAtEnd = await testHelper.usersInDb()
    expect(usersAtEnd).toHaveLength(testResources.initialUsers.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
