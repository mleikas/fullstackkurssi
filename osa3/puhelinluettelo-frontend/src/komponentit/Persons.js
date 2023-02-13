import Person from './Person'

const Persons = ({ persons, query, removePerson }) => (
    <>
        {persons
            .filter(person => person.name.toLowerCase().includes(query))
            .map(({ name, number, id }) => (
                <Person
                    key={id}
                    name={name}
                    number={number}
                    removePerson={removePerson(id, name)}
                />
            ))
        }
    </>
)

export default Persons