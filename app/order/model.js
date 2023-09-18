const mongoose = require('mongoose')
const { model, Schema } = mongoose
const Invoice = require('../invoice/model')

const orderSchema = Schema({
    status: {
        type: String,
        enum: ['waiting_payment', 'processing', 'in_delivery', 'delivered'],
        default: 'waiting_payment'
    },
    delivery_fee: {
        type: Number,
        default: 0
    },
    delivery_address: {
        type: Object,
        provinsi: {type: String, required: [true, 'provinsi harus diisi']},
        kabupaten: {type: String, required: [true, 'kabupaten harus diisi']},
        kecamatan: {type: String, required: [true, 'kecamatan harus diisi']},
        kelurahan: {type: String, required: [true, 'kelurahan harus diisi']},
        detail: {type: String}
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    order_items: [{type: Schema.Types.ObjectId, ref: 'OrderItem'}]
}, {timestamps: true})


orderSchema.virtual('items_count').get(function(){
    return this.order_items.reduce((total, item)=> total + parseInt(item.qty),0)
})
orderSchema.post('save', async function(){
    
    let sub_total = this.order_items.reduce((total, item) => total += (item.price * item.qty),0)
   
    let total = this.order_items.reduce((total, item) => total += (item.price * item.qty) + this.delivery_fee , 0)
    
    let invoice= new Invoice({
        user: this.user,
        order: this._id,
        sub_total: sub_total,
        total: total,
        delivery_fee: parseInt(this.delivery_fee),
        delivery_address: this.delivery_address
    })
    console.log(invoice);
    console.log('invoice');
    await invoice.save()
})

module.exports = model('Order', orderSchema)