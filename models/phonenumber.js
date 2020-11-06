const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url);

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true})
    .then(result => {
        console.log('connected to MongoDB');
    })
    .catch((error) => {
        console.log('error connectting to MongoDB', error.message);
    })

    const phoneNumberSchema = new mongoose.Schema({
        name: String,
        number: String,
    })

    phoneNumberSchema.set('toJSON', {
        transform: (document, returnedObject) => {
            returnedObject.id = returnedObject._id.toString()
            delete returnedObject._id
            delete returnedObject.__V
        }
    })

module.exports = mongoose.model('Phonenumber', phoneNumberSchema)