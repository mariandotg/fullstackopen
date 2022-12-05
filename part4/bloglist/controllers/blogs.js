const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const { title, author, url, likes } = request.body

  const token = request.token
  const user = request.user

  const decodedToken = jwt.verify(token, config.SECRET)

  if (!(token && decodedToken.id)) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = new Blog({ title, author, url, likes, user: user._id })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const token = request.token
  const user = request.user

  const decodedToken = jwt.verify(token, config.SECRET)

  if (!(token && decodedToken.id)) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const id = request.params.id
  const blog = await Blog.findById(id)

  if (blog.user.toString() === user.id.toString()) {
    await Blog.deleteOne({ _id: id })
    response.sendStatus(204).end()
  } else {
    response.status(401).json({ error: 'unauthorized operation' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const likes = request.body
  const id = request.params.id

  const updatedBlog = await Blog.findByIdAndUpdate(id, likes, { new: true })

  updatedBlog
    ? response.status(200).json(updatedBlog.toJSON())
    : response.status(404).end()
})

module.exports = blogsRouter
