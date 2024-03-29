require("dotenv").config()

const express = require("express")
const morgan = require("morgan")
const cors = require("cors")

const Person = require("./models/person")

const app = express()

const PORT = process.env.PORT

app.use(express.json())
app.use(cors())
app.use(express.static("build"))

// eslint-disable-next-line no-unused-vars
morgan.token("data", (request, response) => {
  return request.method === "POST" ? JSON.stringify(request.body) : " "
})

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
)

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

app.get("/info", (request, response, next) => {
  const date = new Date()
  
  Person.find({})
    .then((person) => {
      response.send(`
        <p>Phonebook has info for ${person.length} people</p>
        <p>${date}</p>
      `)
    })
    .catch((error) => next(error))
}) 

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((result) => {
      if (result) {
        response.json(result)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
}) 

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => response.status(204).end())
    .catch((error) => next(error))
})

app.post("/api/persons", (request, response, next) => {
  const { name, number } = request.body

  const newPerson = new Person({ name, number })

  newPerson.save()
    .then((savedPerson) => {
      response.json(savedPerson)
    })
    .catch((error) => next(error))
})

app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body

  const newPerson = { name, number }

  Person.findByIdAndUpdate(request.params.id, newPerson, { new: true, runValidators: true, context: "query" })
    .then((updatedPerson) => {response.json(updatedPerson)})
    .catch((error) => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" })
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(unknownEndpoint)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})