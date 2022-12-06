import axios from 'axios'
import jwt from "jwt-decode"
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getUserId = () => {
  return token ? jwt(token).id : false
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (id, newObject) => {
  const response = await axios.put(`${baseUrl}/${id}`, newObject);
  return response.data;
}

const remove = async (blogId) => {
  const deleteUrl = `${baseUrl}/${blogId}`
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.delete(deleteUrl, config)
  return response.data
}

export default { getAll, getUserId, setToken, create, update, remove }