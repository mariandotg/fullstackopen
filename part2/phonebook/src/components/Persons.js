const Persons = ({personsToShow, deletePerson}) => {
  return (
    <>
      {personsToShow.map((person) => (
        <div key={person.id}>
          {person.name} {person.number} 
          <button onClick={() => deletePerson(person.id, person.name)}>
            delete
          </button>
        </div>
      ))}
    </>
  )
}

export default Persons