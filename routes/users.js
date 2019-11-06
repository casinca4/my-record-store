const express = require('express');
const router = express.Router();
const { getUsers,
    addUser,
    getUser,
    deleteUser,
    updateUser
} = require('../controllers/usersController');


/** GET all the users */
router
    .route('/')
    .get(getUsers)
    .post(addUser);


router
    .route('/:id')
    .get(getUser)
    .delete(deleteUser)
    .put(updateUser);


/** POST a new user */
router.post('/', addUser);


module.exports = router;
