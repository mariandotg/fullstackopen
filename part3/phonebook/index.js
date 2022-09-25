require("dotenv").config()

const express = require("express")
const morgan = require("morgan")
const cors = require("cors")

const Person = require("./models/person")

const app = express()

const PORT = process.env.PORT;

app.use(express.json())
app.use(cors())
app.use(express.static("build"))

morgan.token("data", (request, response) => {
  return request.method === "POST" ? JSON.stringify(request.body) : " "
})

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
)

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
})

/* app.get("/info", (request, response) => {
  const count = persons.length
  const date = new Date()

  response.send(`
    <p>Phonebook has info for ${count} people</p>
    <p>${date}</p>
  `)
})

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if(person) response.json(person)
  else response.status(404).end()
}) */

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
  .then((result) => response.status(204).end())
  .catch((error) => next(error))
})

app.post("/api/persons", (request, response) => {
  const { name, number } = request.body
  
  if(!name || !number) return (
    response.status(400).json({
      error: "the name or number is missing",
    })
    )

  const newPerson = new Person({
    id: Math.floor(Math.random() * 1000), name, number
  })

  newPerson.save().then((savedPerson) => {
    response.json(savedPerson);
  })
})

app.put("/api/persons/:id", (request, response, next) => {
  const { name, number, id } = request.body

  const newPerson = { name, number }

  Person.findByIdAndUpdate(request.params.id, newPerson, { new: true })
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
  }
  
  next(error)
}

app.use(unknownEndpoint)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})