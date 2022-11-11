const lodash = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  let sum = 0
  blogs.forEach((blog) => {
    sum += blog.likes
  })
  return sum
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  const favouriteBlog = blogs.reduce((prev, curr) => {
    return prev.likes > curr.likes ? prev : curr
  })

  const { title, author, likes } = favouriteBlog

  return { title, author, likes }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const authorCount = lodash.countBy(blogs, 'author')

  const topAuthor = Object.keys(authorCount).reduce((a, b) => {
    return authorCount[a] > authorCount[b] ? a : b
  })

  return {
    author: topAuthor,
    blogs: authorCount[topAuthor]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const likesCount = lodash(blogs)
    .groupBy('author')
    .map((objs, key) => ({
      author: key,
      likes: lodash.sumBy(objs, 'likes')
    }))
    .value()

  return likesCount.reduce((a, b) => {
    return a.likes > b.likes ? a : b
  })
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
