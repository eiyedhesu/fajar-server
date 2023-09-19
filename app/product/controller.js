const path = require('path')
const fs = require('fs')
const config = require('../config')
const Product = require ('./model')
const Category = require ('../category/model')
const Tag = require ('../tags/model')
const mongoose =require('mongoose')

const store = async (req, res, next) => {
    console.log(req.body)
    console.log(req.file)
    

    try{
       
        let payload = req.body
        console.log(req.body);
        console.log('req.body');
     
        if (payload.category) {
           
            // let category = await Category.findOne({name : {$regex: payload.category, $options: 'i'}})
            let category = await Category
            .findOne({_id : new mongoose.Types.ObjectId(payload.category)})
            
            console.log(category);
            console.log('category');
            if(category){
                payload = {...payload, category: category._id}
            } else {
                delete payload.category
            }
        }

        if(payload.tags)  {
            let tags = await Tag
            // .findOne({name : {$in : payload.tags} })
            .find({_id : new mongoose.Types.ObjectId(payload.tags)})
            console.log(tags);
            console.log('tags');
            if(tags.length){
                console.log('ke tags length');
                payload = {...payload, tags: tags.map(tag => tag._id)}
            } else {
                delete payload.tags
            }
        }

        if(req.file){
            payload.photo = {}
            let tmp_path = req.file.path
            let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length -1]
            let filename = req.file.filename + '.' + originalExt
            let target_path = path.join(__dirname, '../../','public', 'images', 'products', filename)
            let target_url = path.join('http://localhost:8000/static/public/products', filename)
            
            const src = fs.createReadStream(tmp_path)
            const dest = fs.createWriteStream(target_path)
            
            src.pipe(dest)

            src.on('end', async () => {
                try {
                    payload.photo.data = fs.readFileSync(req.file.path)
                    payload.photo.contentType = req.file.mimetype
                    console.log(payload);
                    console.log('payload.photo');
                    let product = await new Product({...payload, image_url: target_url})
                    await product.save()
                    return res.json(product)

                } catch(err){
                    console.log(err);
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
        console.log(err);
        console.log('err');
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
      let { skip = 0, limit = 100, q = '', category = '', tags = [] } = req.query;
  
      let criteria = {};
  
      if (q.length) {
        criteria = {
          ...criteria,
          name: { $regex: `${q}`, $options: 'i' },
        };
      }
  
      if (category.length) {
        let categoryResult = await Category.findOne({ name: category });
  
        if (categoryResult) {
          criteria = { ...criteria, category: categoryResult._id };
        }
      }
  
      if (tags.length) {
        let tagsResult = await Tag.find({ name: { $in: tags } });
  
        if (tagsResult.length > 0) {
          criteria = {
            ...criteria,
            tags: { $in: tagsResult.map((tag) => tag._id) },
          };
        }
      }
  
      const totalCount = await Product.countDocuments(criteria);
      
      const products = await Product.find(criteria)
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        .select('-photo')
        .populate('category')
        .populate('tags');
      return res.json({
        
        data: products,
        totalCount,
      });
    } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

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
            let target_path = path.join(__dirname, '../..', 'public', 'images', 'products', filename)
            let target_url = path.join('http://localhost:8000/static/public/products', filename)
            const src = fs.createReadStream(tmp_path)
            const dest = fs.createWriteStream(target_path)
            src.pipe(dest)

            src.on('end', async () => {
                try {
                  let product = await Product.findById(id);
                  let currentImage = `${config.rootPath}/public/images/products/${product.image_url}`;
              
                  if (fs.existsSync(currentImage)) {
                    fs.unlinkSync(currentImage);
                  }

                  return res.json({ ...product._doc, image_url: target_url });
                } catch (err) {
                  fs.unlinkSync(target_path);
                  if (err && err.name === 'ValidationError') {
                    return res.json({
                      error: 1,
                      message: err.message,
                      fields: err.errors,
                    });
                  }
                  next(err);
                }
              });
              
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

const searchProduct = async (req,res) => {
    try {
        const {keyword} = req.params
        const results = await Product.find({
            $or: [
                {name:{$regex :keyword, $options: "i"}},
                {description:{$regex :keyword, $options: "i"}}
            ]
        }).select('-photo')
        res.json(results)
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success:false,
            message: 'Error in search product'
        })
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
const getPhoto = async (req, res) => {
  try {
    
    const product = await Product.findById(req.params.id).select("photo");
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.photo && product.photo.data) {
      res.set("Content-Type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    } else {
      return res.status(404).json({
        success: false,
        message: "Photo not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error while getting photo",
      error,
    });
  }
};

const filterProducts = async (req, res) => {
    try {
      const { checked, radio } = req.body;
      let args = {};
      console.log(req.body);
      if (checked.length > 0) args.category = checked;
      if (radio.length > 0) args.tags = { $in: radio };
      const products = await Product.find(args);
      res.status(200).send({
        success: true,
        products,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "Error WHile Filtering Products",
        error,
      });
    }
  };


module.exports = {
    store,
    index,
    update,
    destroy,
    getProductsById,
    getPhoto,
    filterProducts,
    searchProduct
}



