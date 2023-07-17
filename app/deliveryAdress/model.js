const {Schema, model, SchemaType} = require('mongoose')

const deliveryAddressSchema = Schema({

    nama: {
        type: String,
        required: [true, 'Nama alamat harus diisi'],
        maxLength: [255, 'Panjang maksimal nama alamat adalah 255 karakter']
    },
    kelurahan: {
        type: String,
        required: [true, 'Nama kelurahan harus diisi'],
        maxLength: [255, 'Panjang maksimal nama kelurahan adalah 255 karakter']
    },
    kecamatan: {
        type: String,
        required: [true, 'Nama kecamatan harus diisi'],
        maxLength: [255, 'Panjang maksimal nama kecamatan adalah 255 karakter']
    },
    kabupaten: {
        type: String,
        required: [true, 'Nama kabupaten harus diisi'],
        maxLength: [255, 'Panjang maksimal nama kabupaten adalah 255 karakter']
    },
    provinsi: {
        type: String,
        required: [true, 'Nama provinsi harus diisi'],
        maxLength: [255, 'Panjang maksimal nama provinsi adalah 255 karakter']
    },
    detail: {
        type: String,
        required: [true, 'Nama detail alamat harus diisi'],
        maxLength: [255, 'Panjang maksimal nama detail alamat adalah 255 karakter']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true})

module.exports = model('DeliveryAddress', deliveryAddressSchema)