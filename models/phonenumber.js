const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

console.log('connecting to', url);

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true})
    .then(result => {
        console.log('connected to MongoDB');
    })
    .catch((error) => {
        console.log('error connecting to MongoDB', error.message);
    })

    const phoneNumberSchema = new mongoose.Schema({
        name: {
            type: String,
            unique: true
        },
        number: String,
        id: Number,
    })

    phoneNumberSchema.plugin(uniqueValidator)

    phoneNumberSchema.set('toJSON', {
        transform: (document, returnedObject) => {
            returnedObject.id = returnedObject._id.toString()
            delete returnedObject._id
            delete returnedObject.__V
        }
    })

module.exports = mongoose.model('Phonenumber', phoneNumberSchema)