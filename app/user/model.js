const mongoose = require('mongoose')
const { Schema, model,  } = mongoose
const AutoIncrement = require('mongoose-sequence')(mongoose)
const bcrypt = require('bcrypt');


let userSchema = Schema ({

    full_name: {
        type: String,
        required: [true, 'Nama harus diisi'],
        maxlength: [255, 'Panjang nama harus antara 3 - 255 karakter'],
        minlength: [3, 'Panjang nama harus antara 3 - 255 karakter']
    },

    customer_id: {
        type: Number,
    },


    email: {
        type: String,
        required: [true, 'Email harus diisi'],
        maxlength: [255, 'Panjang email harus antara 3 - 255 karakter'],
    },

    password: {
        type: String,
        required: [true, 'Password harus diisi'],
        maxlength: [255, 'Panjang password harus antara 3 - 255 karakter'],
        
    },

    role: {
        type: String,
        required: ['user','admin'],
        maxlength: [5, 'Maksimal 5 karakter']
        
    },

    token: [String]

}, { timestamps: true})

 userSchema.path('email').validate(function (value) {
    var EMAIL_RE = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    console.log(value)
    console.log("value")
    return EMAIL_RE.test(value)
 }, attr => `${attr.email} harus merupakan email yang valid!`)

userSchema.path('email').validate(async function (value){

    try{
        const count = await this.model('User').count({email: value})
        console.log('kesatu');
        return !count

    }catch(err){
        throw err
    }

 }, attr => `${attr.value} sudah terdaftar`)

const HASH_ROUND = 10
userSchema.pre('save', function(next){
    console.log('kedua');
    this.password = bcrypt.hashSync(this.password, HASH_ROUND)
    next()
 })

userSchema.plugin(AutoIncrement, {inc_field: 'customer_id',disable_hooks: true})

module.exports = model ('User', userSchema)