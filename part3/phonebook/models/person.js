const mongoose = require("mongoose")

const url = process.env.MONGODB_URI

console.log("connecting to", url)

mongoose
  .connect(url)
  .then(() => {
    console.log("connected to MongoDB")
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message)
  })

const numberValidators = [
  {
    validator: (number) => {
      return /^\d{2,3}-\d+$/.test(number)
    },
    message: "Invalid phone number",
  },
  {
    validator: (number) => {
      if ((number[2] === "-" || number[3] === "-") && number.length < 9) {
        return false
      }
      return true
    },
    message: "Must be at least 8 digits",
  }
]

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: numberValidators,
    required: true,
  },
})

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model("Person", personSchema)