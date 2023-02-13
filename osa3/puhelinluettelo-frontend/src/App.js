import { useState, useEffect } from 'react'

import Filter from './komponentit/Filter'
import PersonForm from './komponentit/PersonForm'
import Persons from './komponentit/Persons'
import Notification from './komponentit/Notification'
import contactsService from './services/contacts'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterQuery, setFilterQuery] = useState('')
  const [status, setStatus] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    contactsService.getAll()
      .then(initialPersons => setPersons(initialPersons))
  }, [])

  const handleChange = setValue => event => setValue(event.target.value)
  const handleAddNewPerson = event => {
    event.preventDefault()
    const newPerson = { name: newName, number: newNumber }
    const foundPerson = persons.find(person => person.name === newName)

    if (foundPerson) {
      if (window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )) {
        contactsService.update(foundPerson.id, newPerson).then(returnedPerson => {
          setPersons(persons.map(person =>
            person.id !== foundPerson.id ? person : returnedPerson
          ))
        })
          .catch(_error => {
            setStatus('error')
            setMessage(
              `Information of ${foundPerson.name} has already been removed from server`
            )
            setTimeout(() => {
              setStatus(null)
              setMessage(null)
            }, 5000)

            setPersons(persons.filter(person => person.id !== foundPerson.id))
          })
      }
    } else {
      contactsService.create(newPerson).then(addedPerson => {
        setPersons(persons.concat(addedPerson))

        setStatus('success')
        setMessage(`Added ${addedPerson.name}`)
        setTimeout(() => {
          setStatus(null)
          setMessage(null)
        }, 5000)

        setNewName('')
        setNewNumber('')
      })
    }
  }

  const removePerson = (id, name) => () => {
    if (window.confirm(`Delete ${name}?`)) {
      contactsService.remove(id).then(() => {
        setPersons(persons.filter(person => person.name !== name))
      })
    }
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={message} status={status} />
      <Filter query={filterQuery} handleChange={handleChange(setFilterQuery)} />
      <h2>add a new</h2>
      <PersonForm
        name={newName}
        number={newNumber}
        handleChangeName={handleChange(setNewName)}
        handleChangeNumber={handleChange(setNewNumber)}
        addPerson={handleAddNewPerson}
      />
      <h2>Numbers</h2>
      <Persons
        persons={persons}
        query={filterQuery}
        removePerson={removePerson}
      />
    </div>
  )
}

export default App