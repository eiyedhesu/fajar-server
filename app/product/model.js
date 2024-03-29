const mongoose = require ('mongoose')
const {model, Schema} = mongoose

const productSchema = Schema({
    name: {
        type: String,
        minlength: [3, 'Panjang nama makanan minimal 3 karakter'],
        required: [true, 'Nama makanan harus diisi']
    },

    description: {
        type: String,
        maxlength: [1000, 'Panjang deskripsi minimal 1000 karakter']
    },

    price: {
        type: Number,
        default: 0
    },

    image_url:{
        type: String
    },

    photo:{
        data: Buffer,
        contentType: String
    },

    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },

    tags: {
        type: mongoose.ObjectId,
        ref: 'tag'
        }
    

}, {timestamps: true})

module.exports = model('Product', productSchema)

