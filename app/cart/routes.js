const router = require('express').Router()
const { police_check } = require('../../middleware')
const cartController = require('./controller')

router.put('/carts', police_check('update', 'Cart'), cartController.update)
// router.put('/carts', cartController.update)
router.get('/carts', cartController.index)
// router.get('/carts', police_check('read', 'Cart'), cartController.index)
router.post('/carts', cartController.addToCart)

module.exports = router