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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
