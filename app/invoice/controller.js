const { subject } = require('@casl/ability')
const Invoice = require('../invoice/model')
const { policyFor } = require('../../utils')

const show = async(req, res, next) => {
    try{
        let {order_id} = req.params
       
        let invoice = 
        await Invoice
        .findOne({order: order_id})
        .populate('order')
        .populate('user')
        console.log(order_id);
        console.log('order_id');
        return res.json(invoice)
    } catch (err) {
        return res.json({
            error: 1,
            message: 'Error when getting invoice',
            details: err.message
        })
    }
}

module.exports = {
    show
}