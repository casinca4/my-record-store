const express = require('express');
const router = express.Router();
const {
    userValidationRules,
    userValidationErrorHandling
  } = require('../validators/validator');

const { 
    getUsers,
    addUser,
    getUser,
    deleteUser,
    updateUser
} = require('../controllers/usersController');


/** GET all the users */
router
    .route('/')
    .get(getUsers)
    .post(userValidationRules(), userValidationErrorHandling, addUser);


router.route('/me').get(authenticateUser);          // muß hier stehen, kann nicht über module.exports stehen; man weiß nicht, warum

router
    .route('/:id')
    .get(getUser)
    .delete(deleteUser)
    .put(updateUser);


/** POST a new user */
router.post('/', addUser);



module.exports = router;


/*
userValidationRules()       function that returns array
userValidationErrorHandling middleware function
*/