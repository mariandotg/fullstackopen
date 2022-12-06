import { useState } from "react"

const Blog = ({ blog, updateLikes }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = () => {
    const updatedBlog = {
      likes: blog.likes + 1
    }
    
    updateLikes(blog.id, updatedBlog)
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
        </div>
      )}
    </div>
  )
}

export default Blog