const supertest = require('supertest')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const testHelper = require('./test_helper')
const testResources = require('./test_resources')
const config = require('../utils/config')

const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(testResources.initialBlogs)
})

describe('when there is initially some blogs saved', () => {
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
})

describe('addition of a new blog', () => {
  let token = null
  beforeAll(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('12345', 10)
    const user = await new User({ username: 'name', passwordHash }).save()

    const userForToken = { username: 'name', id: user.id }
    return (token = jwt.sign(userForToken, config.SECRET))
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
      .set('Authorization', `Bearer ${token}`)
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
      .set('Authorization', `Bearer ${token}`)
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

    await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(400)

    const blogsAtEnd = await testHelper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(testResources.initialBlogs.length)
  })

  test('fails with status code 401 if user is not authorized', async () => {
    const blogsAtStart = await Blog.find({}).populate('user')
    const blogToDelete = blogsAtStart[0]

    token = null

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(401)

    const blogsAtEnd = await Blog.find({}).populate('user')

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
    expect(blogsAtStart).toEqual(blogsAtEnd)
  })
})

describe('deletion of a blog', () => {
  let token = null
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('12345', 10)
    const user = await new User({ username: 'name', passwordHash }).save()

    const userForToken = { username: 'name', id: user.id }
    token = jwt.sign(userForToken, config.SECRET)

    const newBlog = {
      title: 'some blog',
      author: 'some author',
      url: 'https://www.example.com'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    return token
  })

  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await Blog.find({}).populate('user')
    const blogToDelete = blogsAtStart[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`).set('Authorization', `Bearer ${token}`).expect(204)

    const blogsAtEnd = await Blog.find({}).populate('user')
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

    const titles = blogsAtEnd.map((blog) => blog.title)
    expect(titles).not.toContain(blogToDelete.title)
  })
})

describe('updating a blog', () => {
  test('succeeds with status code 200 if id is valid', async () => {
    const blogsAtStart = await testHelper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ likes: 10 })
      .expect(200)

    const blogsAtEnd = await testHelper.blogsInDb()
    const updatedBlog = blogsAtEnd[0]
    expect(blogsAtEnd).toHaveLength(testResources.initialBlogs.length)
    expect(updatedBlog.likes).toBe(10)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
