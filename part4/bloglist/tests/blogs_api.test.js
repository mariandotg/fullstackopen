const supertest = require('supertest')
const mongoose = require('mongoose')
const testResources = require('./test_resources')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(testResources.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(testResources.initialBlogs.length)
})

test('blogs have id property named id instead of _id', async () => {
  const response = await api.get('/api/blogs')
  const ids = response.body.map((blog) => blog.id)

  for (const id of ids) {
    expect(id).toBeDefined()
  }
})

afterAll(() => {
  mongoose.connection.close()
})
