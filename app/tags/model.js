const mongoose = require ('mongoose')
const {model, Schema} = mongoose

const tagSchema = Schema({
    name: {
        type: String,
        minlength: [3, 'Panjang nama tag minimal 3 karakter'],
        maxlength: [20, 'Panjang nama tag minimal 20 karakter'],
        required: [true, 'Nama tagharus diisi']
    }
})

module.exports = model ('tag', tagSchema)