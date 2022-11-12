const supertest = require('supertest')
const mongoose = require('mongoose')
const testHelper = require('./test_helper')
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
}, 100000)

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

test('a valid blog can be added ', async () => {
  const newBlog = {
    title: 'test blog',
    author: 'Mariano Guillaume',
    url: 'https://www.marianoguillaume.com',
    likes: 77
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await testHelper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(testResources.initialBlogs.length + 1)

  const titles = blogsAtEnd.map((blog) => blog.title)
  expect(titles).toContain('test blog')
})

test('likes property defaults to 0 if missing', async () => {
  const newBlog = {
    title: 'test blog #2',
    author: 'Mariano Guillaume',
    url: 'https://www.marianoguillaume.com'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await testHelper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(testResources.initialBlogs.length + 1)
  expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toBe(0)
})

test('backend responds with status 400 if title and url are missing', async () => {
  const newBlog = {
    likes: 1
  }

  await api.post('/api/blogs').send(newBlog).expect(400)

  const blogsAtEnd = await testHelper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(testResources.initialBlogs.length)
})

afterAll(() => {
  mongoose.connection.close()
})
