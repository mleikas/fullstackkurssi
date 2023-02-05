const Person = ({ name, number, removePerson }) => (
    <div key={name}>
        {name} {number} <button onClick={removePerson}>delete</button>
    </div>

)

export default Person