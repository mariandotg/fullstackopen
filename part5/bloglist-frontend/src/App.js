import { useState, useEffect } from 'react'

import Blog from './components/Blog'
import BlogForm from './components/BlogForm';
import LoginForm from './components/LoginForm'

import blogService from './services/blogs'
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )  
  }, [])

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
      setErrorMessage("Wrong Credentials")
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem("FSOpenBlogListAppUser")
    setUser(null)
  }

  const createBlog = async (title, author, url) => {
    try {
      const blog = await blogService.create({
        title,
        author,
        url,
      })
      setBlogs(blogs.concat(blog))
    } catch (exception) {
      setErrorMessage("Something went horribly wrong")
    }
  }

  return (
    <div>
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
            <BlogForm createBlog={createBlog} />
            {blogs.map(blog =>
              <Blog key={blog.id} blog={blog} />
            )}
        </div>
      )}
    </div>
  )
}

export default App
