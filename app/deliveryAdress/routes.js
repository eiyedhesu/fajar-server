const router = require('express').Router()
const deliveryaddressController = require('./controller')
const {police_check} = require('../../middleware')


router.post('/delivery-addresses',police_check('create', 'DeliveryAddress'),deliveryaddressController.store)
router.put('/delivery-addresses',police_check('update','DeliveryAdress'),deliveryaddressController.update)
router.delete('/delivery-addresses/:id',police_check('destroy','DeliveryAdress'),deliveryaddressController.destroy)
router.get('/delivery-addresses/:id',police_check('view', 'DeliveryAddress'),deliveryaddressController.index)
module.exports = router