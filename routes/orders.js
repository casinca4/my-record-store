const express = require('express');
const router = express.Router();
const { getOrders,
    addOrder,
    getOrder,
    deleteOrder,
    updateOrder
} = require('../controllers/ordersController'); //{} bezieht sich ordersController.js    
// console.log(require('../controllers/ordersController'));    // { getOrders: [Function], addOrder: [Function] }  key, key = key value, key value
// require controllers = getOrders






/** GET all the orders */
router
    .route('/')
    .get(getOrders)
    .post(addOrder)

router
    .route('/:id')
    .get(getOrder)
    .delete(deleteOrder)
    .put(updateOrder);

/** POST a new order */
router.post('/', addOrder);

module.exports = router;            //hier ist exports kein object


