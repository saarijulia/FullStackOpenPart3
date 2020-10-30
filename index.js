const { request } = require('express')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(express.json())
app.use(express.static('build'))
app.use(morgan('tiny'))
app.use(cors())

let phonenumbers = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Phonebook</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(phonenumbers)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = phonenumbers.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }

})

app.get('/info', (request, response) => {
    const numCount = phonenumbers.length
    response.send(`<p>Phonebook has info for ${numCount} people</p> <br/> ${Date()}`)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log('Deleting person', phonenumbers.find(person => person.id === id));
    phonenumbers = phonenumbers.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    const generateId = () => {
        const maxId = phonenumbers.length > 0
            ? Math.max(...phonenumbers.map(n => n.id))
            : 0
        return maxId + 1
    }

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    } else if (phonenumbers.some(person => person.name == body.name)) {
        return response.status(400).json({
            error: 'person already exists in phonebook'
        })
    } else {

        const person = {
            id: generateId(),
            name: body.name,
            number: body.number
        }
        console.log(person);
        phonenumbers = phonenumbers.concat(person)
        response.json(person)
    }


})

const PORT = process.env.PRT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
