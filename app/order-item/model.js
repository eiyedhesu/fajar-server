const mongoose = require('mongoose')
const {model, Schema} = mongoose

const orderItemSchema = Schema ({
    name: {
        type: String,
        minlength: [5, 'Panjang nama makanan minimal 5 karakter'],
        required: [true, 'Nama harus diisi']
    },
    price: {
        type: Number,
        required: [true, 'Harga harus diisi']
    },
    qty: {
        type: Number,
        required: [true, 'Nama harus diisi'],
        min: [1, 'Jumlah barang minimal 1']
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order'
    },
})

module.exports = model('OrderItem', orderItemSchema)