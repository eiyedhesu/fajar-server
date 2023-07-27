const CartItem = require('../cart.item/model')
const DeliveryAddress= require('../deliveryAdress/model')
const Order = require('../order/model')
const {Types} = require('mongoose')
const Orderitem = require ('../order-item/model')

const store = async(req, res, next) => {
    try{
        let {delivery_fee, delivery_adress} = req.body
        let items = await CartItem.find({user: req.user._id}).populate('product')
        if(!items){
            return res.json({
                error: 1,
                message: `You're not create order because you have not items in cart`
            })
        }
        let address = await DeliveryAddress.findById(delivery_adress)
        let order = new Order({
            _id: new Types.ObjectId(),
            status: 'waiting_payment',
            delivery_fee: delivery_fee,
            delivery_adress: {
                provinsi: address.provinsi,
                kabupaten: address.kabupaten,
                kecamatan: address.kecamatan,
                kelurahan: address.kelurahan,
                detail: address.detail
            },
            user: req.user._id
        })
        let orderItems = await orderItem.insertMany(items.map(item=> ({
            ...item,
            name: item.product.name,
            qty: parseInt(item.qty),
            price: parseInt(item.product.price),
            order: order._id,
            product: item.product._id
        })))
        orderItems.forEach(item=> order.order_items.push(item))
        order.save()
        await CartItem.deleteMany({user: req.user._id})
        return res.json(order)    
    } catch (error){
        if(error && error.name == 'ValidationError'){
            return res.json ({
                error: 1,
                message: error.message,
                fields: error.errors
            })
        }
        next(error)
    }
}

const index = async(req, res, next) => {
    try{
        let {skip = 0, limit = 10} = req.query
        let count = await Order.find({user: req.user._id}).countDocument()
        let orders = 
            await Order
            .find({user: req.user._id})
            .skip(parseInt(skip))
            .limit(parseInt(limit))
            .populate('order_items')
            .sort('-createdAt')
        return res.json({
            data: orders.map(order => order.toJson({virtuals: true})),
            count
        })
    }catch (error){
        if(error && error.name == ' ValidationError '){
            return res.json({
                error: 1,
                message: error.mesage,
                fields: error.errors,
            })
        }
        next(error)
    }
}

module.exports = {
    store,
    index
}