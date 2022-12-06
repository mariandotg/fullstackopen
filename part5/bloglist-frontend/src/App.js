import { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from "./components/Togglable"

import blogService from './services/blogs'
import loginService from "./services/login"

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null);
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )  
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setNotification(null)
    }, 5000)
    return () => {
      clearTimeout(timer)
    }
  }, [notification])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("FSOpenBlogListAppUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username,
        password,
      })
      blogService.setToken(user.token)
      setUser(user)
      window.localStorage.setItem("FSOpenBlogListAppUser", JSON.stringify(user))
    } catch (exception) {
      setNotification("Error: Wrong Credentials")
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem("FSOpenBlogListAppUser")
    setUser(null)
  }

  const createBlog = async (title, author, url) => {
    try {
      blogFormRef.current.toggleVisibility()
      const blog = await blogService.create({
        title,
        author,
        url,
      })
      setBlogs(blogs.concat(blog))
      setNotification(`A new blog ${title} by ${author} added`)
    } catch (exception) {
      setNotification("Error: Something went horribly wrong")
    }
  }

  const blogFormRef = useRef()

  return (
    <div>
      <Notification message={notification} />
      {user === null ? (
        <div>
          <h2>log in to application</h2>
          <LoginForm handleLogin={handleLogin} />
        </div>
        ) : (
          <div>
            <p>
              <span className="active-user">{user.name}</span> logged in
              <button onClick={handleLogout}>logout</button>
            </p>
            <h2>blogs</h2>
            <Togglable buttonLabel="new blog" ref={blogFormRef}>
              <BlogForm createBlog={createBlog} />
            </Togglable>
            {blogs.map(blog =>
              <Blog key={blog.id} blog={blog} />
            )}
        </div>
      )}
    </div>
  )
}

export default App
