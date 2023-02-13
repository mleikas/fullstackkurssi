require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
const Person = require('./models/person')

app.use((cors()))
app.use(express.json())

app.use(express.static('build'))

app.use(morgan('METHOD: :method - URL: :url - STATUS: :status - RESPONSE TIME: :response-time[3] ms - POSTED DATA: :postData'
))
morgan.token('postData', function (request, response, param) {
    return JSON.stringify(request.body)
})



let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"

    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"

    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"

    },
    {
        "id": 4,
        "name": "Mary Poppendick",
        "number": "39-23-6423122"

    }
]

app.get("/api/persons", (_request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info', (request, response) => {
    const responseStr = `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
    `

    response.send(responseStr)
})

app.get("/api/persons/:id", (request, response) => {
    Person.findById(request.params.id).then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })

})

const randomId = () => Math.floor((Math.random() * 1000000) + 1)

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.number) {
        return response.status(400).json({
            error: 'number is missing',
        })
    }

    if (!body.name) {
        return response.status(400).json({
            error: 'name is missing',
        })
    }

    const foundPerson = persons.find(person => person.name === body.name)

    if (foundPerson) {
        return response.status(400).json({
            error: 'name must be unique',
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})