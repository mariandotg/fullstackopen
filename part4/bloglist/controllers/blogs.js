const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const { title, author, url, likes } = request.body
  const user = await User.find({})
  const blog = new Blog({ title, author, url, likes, user: user[0]._id })

  const savedBlog = await blog.save()
  user[0].blogs = user[0].blogs.concat(savedBlog._id)
  await user[0].save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
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
