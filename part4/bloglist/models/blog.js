const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 3,
    maxlength: 50,
    required: true
  },
  author: {
    type: String,
    minlength: 3,
    maxlength: 50,
    required: true
  },
  url: {
    type: String,
    minlength: 6,
    maxlength: 300,
    required: true
  },
  likes: {
    type: Number,
    minlength: 1,
    maxlength: 10,
    required: true
  }
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog
