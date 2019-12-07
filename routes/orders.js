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
const auth = require('../middleware/authenticator');






/** GET all the orders */
router
    .route('/')
    .get(auth, getOrders)
    .post(auth, addOrder)

router
    .route('/:id')
    .get(auth, getOrder)
    .delete(auth, deleteOrder)
    .put(auth, updateOrder);

/** POST a new order */
router.post('/', addOrder);

module.exports = router;            //hier ist exports kein object


