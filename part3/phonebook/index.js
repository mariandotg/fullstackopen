const express = require("express")
const morgan = require("morgan")
const app = express()

const PORT = 3001

app.use(express.json())
app.use(morgan("tiny"))

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
]

app.get("/api/persons", (request, response) => {
  response.json(persons)
})

app.get("/info", (request, response) => {
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
})

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter((person) => person.id !== id)

  response.status(204).end()
})

app.post("/api/persons", (request, response) => {
  const body = request.body
  const { name, number } = body
  const personExists = persons.find((person) => person.name === name)

  if(!name || !number) return (
    response.status(400).json({
      error: "the name or number is missing",
    })
  )

  if(personExists) return (
    response.status(400).json({
      error: "name must be unique",
    })
  )

  const newPerson = { id: Math.floor(Math.random() * 1000), name, number }

  persons = [...persons, newPerson]

  response.json(newPerson)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})