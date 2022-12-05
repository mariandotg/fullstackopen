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

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username,
        password,
      })
      setUser(user)
    } catch (exception) {
      setErrorMessage("Wrong Credentials")
      console.log(exception)
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
