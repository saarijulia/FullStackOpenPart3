const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log("please provide password as an argument: node mongo.js <password> and optionally a phonenumber <Name> <Number>");
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://julia_studies:${password}@cluster0.c1k88.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const phoneNumberSchema = new mongoose.Schema({
    id: Number,
    name: String,
    number: String,
})

const Phonenumber = mongoose.model('Phonenumber', phoneNumberSchema)


if (process.argv[3] && process.argv[4]) {
    const inputName = process.argv[3]
    const inputNumber = process.argv[4]
    const phoneNumber = new Phonenumber({
        name: inputName,
        number: inputNumber
    })
    phoneNumber.save().then(result => {
        console.log(inputName, ' ', inputNumber, ' added!');
        mongoose.connection.close();
    })
} else {
    Phonenumber.find({}).then(result => {
        result.forEach(phonenumber => {
            console.log(phonenumber.name, ' ', phonenumber.number);
        })
        mongoose.connection.close();
    })
}






