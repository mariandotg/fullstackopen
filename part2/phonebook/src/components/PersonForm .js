const PersonForm  = ({onSubmit, newPerson, handleChange}) => {
  return (
    <form onSubmit={onSubmit}>
        <div>
          name: <input name="name" value={newPerson.name} onChange={handleChange} />
        </div>
        <div>
          number: <input name="number" value={newPerson.number} onChange={handleChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

export default PersonForm 