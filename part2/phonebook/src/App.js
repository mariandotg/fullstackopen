import { useState, useEffect } from 'react'
import personsServices from "./services/persons"
import Filter from './components/Filter'
import PersonForm from './components/PersonForm '
import Persons from './components/Persons'
import Notification from "./components/Notification"

const App = () => {
  const [persons, setPersons] = useState([])
  const [newPerson, setNewPerson] = useState({ name: '', number: '' })
  const [filter, setFilter] = useState('')
  const [personsToShow, setPersonsToShow] = useState(persons);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    personsServices.getAll().then(response => {
      setPersons(response)
      setPersonsToShow(response)
    })
  }, [])

  useEffect(() => {
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  }, [message]);

  const filterByName = (event) => {
    const search = event.target.value;
    setFilter(search);
    setPersonsToShow(
      persons.filter((person) => person.name.toLowerCase().includes(search.toLowerCase()))
    );
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewPerson((prev) => ({...prev, [name]: value}));
  };

  const handleSubmit = (event) => {
    event.preventDefault()

    const currentName = persons.filter((person) => person.name === newPerson.name);
    if(currentName.length !== 0) {
      if (
        window.confirm(
          `${newPerson.name} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        personsServices
          .update(currentName[0].id, newPerson)
          .then((returnedPerson) => {
            const updatedPersons = persons.map((person) =>
              person.id !== returnedPerson.id ? person : returnedPerson
            );
            setPersons(updatedPersons);
            setPersonsToShow(updatedPersons);
            setMessage(`Updated ${newPerson.name}`);
          });
      }
    }
    
    personsServices.create(newPerson).then((response) => {
        setPersons((prev) => [...prev, response])
        setPersonsToShow((prev) => [...prev, response])
        setMessage(`Added ${newPerson.name}`);
        setNewPerson({ name: "", number: "" })
      })
  }

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personsServices.remove(id).then((response) => {
        const updatedPersons = persons.filter((person) => person.id !== id);
        setPersons(updatedPersons);
        setPersonsToShow(updatedPersons);
      });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter filter={filter} filterByName={filterByName} />
      <h3>Add a new</h3>
      <PersonForm onSubmit={handleSubmit} newPerson={newPerson} handleChange={handleChange} />
      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} deletePerson={deletePerson} />
    </div>
  )
}

export default App