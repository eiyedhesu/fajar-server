const path = require('path')
const fs = require('fs')
const config = require('../config')
const Product = require ('./model')
const Category = require ('../category/model')
const Tag = require ('../tags/model')

const store = async (req, res, next) => {
    console.log(req.body)
    console.log(req.file)
    

    try{
        let payload = req.body
        console.log(req.body);
        console.log('req.body');
        if (payload.category) {
            let category = await Category
            .findOne({name : {$regex: payload.category, $options: 'i'}})
            if(category){
                payload = {...payload, category: category._id}
            } else {
                delete payload.category
            }
        }
        
        if(payload.tags && payload.length > 0)  {
            let tags = await Tag
            .findOne({name : {$in : payload.tags} })
            if(tags.length){
                payload = {...payload, tags: tags.map(tag => tag._id)}
            } else {
                delete payload.tags
            }
        }

        if(req.file){
            let tmp_path = req.file.path
            let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length -1]
            let filename = req.file.filename + '.' + originalExt
            let target_path = path.join(__dirname, 'public', 'images', 'products', filename)
            
            const src = fs.createReadStream(tmp_path)
            const dest = fs.createWriteStream(target_path)
            src.pipe(dest)

            src.on('end', async () => {
                try {
                    let product = await new Product({...payload, image_url: target_path})
                    await product.save()
                    return res.json(product)

                } catch(err){
                    fs.unlinkSync(target_path)
                    if(err && err.name === 'ValidationError'){
                        return res.json({
                            error: 1,
                            message: err.message,
                            fields: err.errors
                        })
                    }
                    next(err)
                }
            })
        
            src.on('error', async (err) => {
                next(err);
            });

        }else {
            let product = await new Product(payload)
            await product.save()
            return res.json(product)
        
        }
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



const index = async (req, res, next) => {
    try {
        let{ skip= 0, limit = 10, q = '', category = '', tags = [] } = req.query
        
        let criteria = {}

        if(q.length){
            criteria = {
                ...criteria,
                name: {$regex: `${q}`, $options: 'i'}
            }
        }

        if(category.length){
            let categoryResult = await Category.fineOne({name: {$regex: `${category}`}, $options: 'i'})
        
            if(categoryResult){
                criteria = {...criteria, category: categoryResult._id}
            }
        }

        if(tags.length){
            let tagsResult = await tags.find({name: {$in: tags}})
            if(tagsResult.length > 0){
                criteria = {...criteria, tags: {$in: tagsResult.map(tag => tag._id)}}
            }
        }

        let count = await Product.find().countDocuments()
        let product = await Product
        .find(criteria)
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        .populate('category')
        .populate('tags')
        return res.json({
            data: product,
            count
        })
    }catch (err){
        next (err)
    }
}

const update = async (req, res, next) => {
    try{
        let payload = req.body
        let { id } = req.params
        
        if(payload.category) {
            let category = await Category
            .findOne({name : {$regex: payload.category, $options: 'i'}})
            if(category){
                payload = {...payload, category: category._id}
            } else {
                delete payload.category
            }
        }

        if(payload.tags && payload.tags.length > 0) {
            let tags = await Tag
            .find({name : {$in : payload.tags} })
            if(tags && tags.length > 0){
                payload = {...payload, tags: tags.map(tag => tag._id)}
            } else {
                delete payload.tags
            }
        }

        if(req.file){
            let tmp_path = req.file.path
            let originalExt = req.file.origilanname.split('.')[req.file.original.split('.').length -1]
            let filename = req.file.filename + '.' + originalExt
            let target_path = path.join(__dirname, 'public', 'images', 'products', filename)
            const src = fs.createReadStream(tmp_path)
            const dest = fs.createWriteStream(target_path)
            src.pipe(dest)

            src.on('end', async () => {
                try {
                    let product = await Product.findById(id)
                    let currentImage = `${config.rootPath}/public/images/products/${product.image_url}`
                    
                    if(fs.existsSync(currentImage)){
                        fs.unlinkSync(currentImage)
                    }

                    product = await Product.findByIdAndUpdate(id, payload, {
                        new: true,
                        runValidators: true
                    })
                    const imageUrl = `http://localhost:8000/images/products/${filename}`;
                    return res.json({ ...product._doc, image_url: imageUrl });

                } catch(err){
                    fs.unlinkSync(target_path)
                    if(err && err.name === 'ValidationError'){
                        return res.json({
                            error: 1,
                            message: err.message,
                            fields: err.errors
                        })
                    }
                    next(err)
                }
            })
        
            src.on('error', async() => {
                next(err)
            })

        }else {
            let product = await Product.findByIdAndUpdate(id, payload, {
                new: true,
                runValidators: true
            })
            return res.json(product)
        }
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

const destroy = async (req, res, next) => {
    try{
        let product = await Product.findByIdAndDelete(req.params.id)
        let currentImage = `${config.rootPath}/public/images/products/${product.image_url}`
        if(fs.existsSync(currentImage)){
            fs.unlinkSync(currentImage)
        }
        return res.json(product)
    }catch(err){
        next(err)
    }
}
const getProductsById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        return res.json(product);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

module.exports = {
    store,
    index,
    update,
    destroy,
    getProductsById
}



