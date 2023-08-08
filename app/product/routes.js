const router = require('express').Router()
const multer = require('multer')
const os = require('os')


const productController = require ('./controller')
const { police_check } = require('../../middleware')

router.get('/products', productController.index)
router.post('/products', multer({dest: "images/products"}).single('image'), police_check('create', 'Product') ,productController.store)
router.put('/products:id', multer({dest: "images/products"}).single('image'), police_check('update', 'Product') ,productController.update)
router.delete('products/:id', police_check('delete', 'Product') ,productController.destroy)

module.exports = router