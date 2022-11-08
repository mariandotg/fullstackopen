const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.6eqjwkq.mongodb.net/noteApp?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})
  
const Person = mongoose.model("Person", personSchema)

mongoose.connect(url)

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log("phonebook:")
    result.map((person) => console.log(person.name, person.number))
    mongoose.connection.close()
  })
}

if (process.argv.length > 3) {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name,
    number,
  })

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}