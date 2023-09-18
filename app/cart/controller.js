const Product = require ('../product/model')
const CartItem = require('../cart.item/model')

const update = async (req, res, next) => {
   
    try {
      const { items } = req.body;
      console.log(req.body);
      const productIds = items.map((item) => item.product._id);
      const products = await Product.find({ _id: { $in: productIds } });
      let cartItems = items.map((item) => {
       console.log(item);
       console.log('item');
        let relatedProduct = products.find(
          (product) => product._id.toString() === item.product._id
            
          );
        return {
          product: relatedProduct._id,
          price: relatedProduct.price,
          name: relatedProduct.name,
          user: req.user._id,
          qty: item.qty,
          
        };
      });
      await CartItem.deleteMany({ user: req.user._id });
      console.log({ user: req.user._id });
      await CartItem.bulkWrite(
        cartItems.map((item) => {
          return {
            updateOne: {
              filter: {
                user: req.user._id,
                product: item.product,
              },
              update: item,
              upsert: true,
            },
          };
        })
      );
        console.log(cartItems);
        console.log('cartItems');
      return res.json(cartItems);
    } catch (err) {
      console.log(err);
      if (err && err.name === 'ValidationError') {
        return res.json({
          error: 1,
          message: err.message,
          fields: err.errors,
        });
      }
      next(err);
    }
  };
  

const index = async (req, res, next) => {

  try {
        const items = await CartItem.find({ user: req.user._id })
        .populate({
        path: 'product',
        select: '-photo' 
  });
return res.json(items);
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

const addToCart = async (req, res, next) => {
  console.log(req.body);
  try {
    const { product: productId, qty } = req.body;
    const userId = req.user._id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Produk tidak ditemukan.' });
    }else{
      let cartItem = await CartItem.findOne({ user: userId, product: productId });

      if (cartItem) {
        cartItem.qty += qty;
      } else {
        cartItem = new CartItem({
          user: userId,
          product: productId,
          qty,
          price: product.price,
          name: product.name,
        });
      }
      await cartItem.save();
      return res.status(201).json(cartItem);
    }

   
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

 

module.exports = {
    update,
    index,
    addToCart
}