import { useState } from "react"

import blogService from "../services/blogs"

const Blog = ({ blog, updateLikes, deleteBlog }) => {
  const [visible, setVisible] = useState(false)

  const userId = blogService.getUserId()

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = () => {
    const updatedBlog = {
      likes: blog.likes + 1
    }

    updateLikes(blog.id, updatedBlog)
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog.id)
    }
  }

  return (
    <div className="blog-style">
      <div>
        {blog.title}
        <button onClick={toggleVisibility}>{visible ? "hide" : "show"}</button>
      </div>
      {visible && (
        <div>
          <div>{blog.author}</div>
          <div>{blog.url}</div>
          <div>
            Likes: {blog.likes} <button onClick={handleLike}>like</button>
          </div>
          {(blog.user.id === userId || blog.user === userId) && (
            <button onClick={handleDelete}>
              delete
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog