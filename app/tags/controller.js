const Tags = require('./model')

const store = async(req, res, next) => {
    try{
        let payload = req.body
        let tag = new Tags(payload)
        await tag.save()
        return res.json(tag)
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

const update = async(req, res, next) => {
    try{
        let payload = req.body
        let tag = await Tags.findByIdAndUpdate(req.params.id, payload, {new:true, runValidators: true})
        return res.json(tag)
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

const destroy = async(req, res, next) => {
    try{
        let tag = await Tags.findByIdAndDelete(req.params.id)
        return res.json(tag)
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
        let tag = await Tags.find()
        return res.json(tag)
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

module.exports = {
    store,
    update,
    destroy,
    index
}