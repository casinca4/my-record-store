const express = require('express');
const router = express.Router();
const {                     // wieso {} ????????????
    getRecords,
    addRecord,
    getRecord,
    deleteRecord,
    updateRecord
} = require('../controllers/recordsController');
const auth = require('../middleware/authenticator');
const isAdmin = require('../middleware/rolesAuthenticator');


/** GET all the records */
router
    .route('/')
    .get(getRecords)
    .post(auth, isAdmin, addRecord);

router
    .route('/:id')
    .get(getRecord)
    .delete(auth, isAdmin, deleteRecord)     //someone who has an account, wir haben noch keine Regel erstellt, kann also auch admin sein
    .put(auth, isAdmin, updateRecord);

/** POST a new record */
// router.post('/', addRecord);

module.exports = router;