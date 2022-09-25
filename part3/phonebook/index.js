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
})

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter((person) => person.id !== id)

  response.status(204).end()
})*/

app.delete("/api/persons/:id", (request, response) => {
  Person.findByIdAndRemove(request.params.id)
  .then((result) => response.status(204).end())
  .catch((error) => console.log(error))
})

app.post("/api/persons", (request, response) => {
  const body = request.body
  const { name, number } = body
  
  if(!name || !number) return (
    response.status(400).json({
      error: "the name or number is missing",
    })
    )
    
  /*const personExists = persons.find((person) => person.name === name)

  if(personExists) return (
    response.status(400).json({
      error: "name must be unique",
    })
  )*/

  const newPerson = new Person({
    id: Math.floor(Math.random() * 1000), name, number
  })

  newPerson.save().then((savedPerson) => {
    response.json(savedPerson);
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})