const express = require('express');
const router = express.Router();
const {
  userValidationRules,
  userValidationErrorHandling
} = require('../validators/validator');
const auth = require('../middleware/authenticator');
const isAdmin = require('../middleware/rolesAuthenticator');

const {
  getUsers,
  addUser,
  getUser,
  deleteUser,
  updateUser,
  authenticateUser,
  loginUser
} = require('../controllers/usersController');



/** GET all the users */
router
    .route('/')
    .get(auth, isAdmin, getUsers)      //hier muß user authentifiziert werden
    .post(userValidationRules(), userValidationErrorHandling, addUser);


router.route('/me').get(auth, authenticateUser);          // muß hier stehen, kann nicht über module.exports stehen; man weiß nicht, warum; erst auth function, dann die danach (controller)
router.route('/login').post(loginUser);

router
    .route('/:id')
    .get(auth, getUser)       // auth ist middleware
    .delete(auth, deleteUser)
    .put(auth, updateUser);


module.exports = router;


/*
userValidationRules()       function that returns array
userValidationErrorHandling middleware function
*/