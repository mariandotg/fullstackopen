import { useState, useEffect } from 'react'
import personsServices from "./services/persons"
import Filter from './components/Filter'
import PersonForm from './components/PersonForm '
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newPerson, setNewPerson] = useState({ name: '', number: '' })
  const [filter, setFilter] = useState('')
  const [personsToShow, setPersonsToShow] = useState(persons);

  useEffect(() => {
    personsServices.getAll().then(response => {
      setPersons(response)
      setPersonsToShow(response)
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

    personsServices.create(person).then((response) => {
        setPersons((prev) => [...prev, response])
        setPersonsToShow((prev) => [...prev, response])
        setNewPerson({ name: "", number: "" })
      })
  }

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personsServices.remove(id).then((response) => {
        console.log(response)
        const updatedPersons = persons.filter((person) => person.id !== id);
        setPersons(updatedPersons);
        setPersonsToShow(updatedPersons);
      });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} filterByName={filterByName} />
      <h3>Add a new</h3>
      <PersonForm onSubmit={handleSubmit} newPerson={newPerson} handleChange={handleChange} />
      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} deletePerson={deletePerson} />
    </div>
  )
}

export default App