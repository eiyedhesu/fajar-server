const {subject} = require('@casl/ability')
const DeliveryAddress = require ('./model')
const { policyFor } = require('../../utils')

const store = async (req, res, next) => {
    console.log(req.body);
    console.log('req.body');
    try{
        let payload = req.body
        let user = req.user
        let address = new DeliveryAddress({...payload, user: user._id})
        await address.save()
        return res.json(address)
    }catch (err) {
        if(err && err.name === 'ValidationError'){
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            })
        }
        next(err)
    }
}
const update = async(req, res, next) => {
    let policy = policyFor(req.user)
    try {
       let {_id, ...payload} = req.body
       let {id} = req.params
       let address = await DeliveryAddress.findById(id)
       let subjectAddress = subject('DeliveryAddress', {...address, user_id: address.user})
    if(!policy.can('update', subjectAddress)){
        return res.json({
            error: 1,
            message: `You're not allowed to modify this resource`
        })
    }
        address = await DeliveryAddress.findByIdAndUpdate(id, payload, {new: true})
        res.json(address)    
    }catch(error) {
        if(err && err.name === 'ValidationError'){
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            })
        }
        next(error)
    }
}

const destroy = async(req, res, next) => {
    try{
        let {id} = req.params
       let address = await DeliveryAddress.findById(id)
       let subjectAddress = subject('DeliveryAddress', {...address, user_id: address.user})
       let policy = policyFor(req.user) 
       if(!policy.can('update', subjectAddress)){
        return res.json({
            error: 1,
            message: `You're not allowed to modify this resource`
        })
    }
        address = await DeliveryAddress.findByIdAndDelete(id)
        return res.json(address)
    }catch(err){
        if(err && err.name === 'ValidationError'){
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            })
        }
        next(err)
    }
}

const index = async(req, res, next) => {
    try{
     let {skip = 0, limit = 10} = req.query
     let count = await DeliveryAddress.find({user: req.user._id}).countDocuments()
        let address = await DeliveryAddress
        .find({user: req.user._id})
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        .sort('-createdAt')
        return res.json({
            data: address,
            count
        })
    }catch (err){
        if(err && err.name === 'ValidationError'){
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            })
        }
        next(err)
    }
}
module.exports = {
    store,
    update,
    destroy,
    index
}


