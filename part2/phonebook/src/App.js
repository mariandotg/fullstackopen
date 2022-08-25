import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm '
import Persons from './components/Persons'
import axios from "axios"

const App = () => {
  const [persons, setPersons] = useState([])
  const [newPerson, setNewPerson] = useState({ name: '', number: '' })
  const [filter, setFilter] = useState('')
  const [personsToShow, setPersonsToShow] = useState(persons);

  useEffect(() => {
    axios.get("http://localhost:3001/persons").then(response => {
      setPersons(response.data)
      setPersonsToShow(response.data)
    })
  }, [])

  const filterByName = (event) => {
    const search = event.target.value;
    setFilter(search);
    setPersonsToShow(
      persons.filter((person) => person.name.toLowerCase().includes(search.toLowerCase()))
    );
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log(event.target.value)
    setNewPerson((prev) => ({...prev, [name]: value}));
  };

  const handleSubmit = (event) => {
    event.preventDefault()

    const currentName = persons.filter((person) => person.name === newPerson.name);
    if(currentName.length !== 0) return alert(`${newPerson.name} is already added to phonebook`)

    const person = {
      ...newPerson,
      id:persons.length + 1
    }
    setPersons((prev) => [...prev, person])
    setPersonsToShow((prev) => [...prev, person])
    setNewPerson({ name: "", number: "" })
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} filterByName={filterByName}/>
      <h3>Add a new</h3>
      <PersonForm onSubmit={handleSubmit} newPerson={newPerson} handleChange={handleChange} />
      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} />
    </div>
  )
}

export default App