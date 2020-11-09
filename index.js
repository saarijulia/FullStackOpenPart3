require('dotenv').config()
const { request } = require('express')
const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())
app.use(express.static('build'))
app.use(morgan('tiny'))
app.use(express.static('build'))

const cors = require('cors')
app.use(cors())

const Phonenumber = require('./models/phonenumber')


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
    Phonenumber.find({}).then(result => {
        result.forEach(phonenumber => {
            console.log(phonenumber.name, ' ', phonenumber.number);
        })
        response.json(result)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    const id = Phonenumber.findById(request.params.id)
        .then(number => {
            if (number) {
                response.json(number)
            } else {
                response.status(404).end
            }
        })
        .catch(error => next(error))

})

app.get('/info', (request, response) => {
    const numCount = phonenumbers.length
    response.send(`<p>Phonebook has info for ${numCount} people</p> <br/> ${Date()}`)
})

app.delete('/api/persons/:id', (request, response, next) => {
    Phonenumber.findByIdAndRemove(request.params.id)
        .then(phonenumber => {
            if (phonenumber) {
                console.log('deleted', phonenumber);
                
            } else {
                response.status(204).end()
            }
        })
        .catch(error => next(error))
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
        const phonenumber = new Phonenumber({
            name: body.name,
            number: body.number,
            id: generateId()
        })

        phonenumber.save().then(savedPhonenumber => {
            response.json(savedPhonenumber)
            console.log(savedPhonenumber);
        })
    }
})

const errorHandler = (error, request, response, next) => {
    console.log(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})