const router = require('express').Router()
const multer = require('multer')
const os = require('os')
const productController = require ('./controller')
const { police_check } = require('../../middleware')

router.get('/products', productController.index)
router.get('/products-photo/:id', productController.getPhoto)
router.get('/products/:id', productController.getProductsById)
router.post('/products', multer({dest: os.tmpdir()}).single('image'), police_check('create', 'Product') ,productController.store)
router.post('/product-filters', productController.filterProducts);
router.put('/products/:id', multer({dest: os.tmpdir()}).single('image'), police_check('update', 'Product') ,productController.update)
router.delete('/products/:id', police_check('delete', 'Product') ,productController.destroy)
router.get('/products/search/:keyword', productController.searchProduct);
module.exports = router