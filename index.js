const express = require('express')
const app = express()

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

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
