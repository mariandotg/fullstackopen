import { useState, useEffect } from 'react'

import Blog from './components/Blog'
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
      setUser(user)
      window.localStorage.setItem("FSOpenBlogListAppUser", JSON.stringify(user));
    } catch (exception) {
      setErrorMessage("Wrong Credentials")
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem("FSOpenBlogListAppUser")
    setUser(null)
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
            {blogs.map(blog =>
              <Blog key={blog.id} blog={blog} />
            )}
        </div>
      )}
    </div>
  )
}

export default App
