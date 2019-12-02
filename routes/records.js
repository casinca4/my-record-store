//diese Datei haben wir hinzugefügt

const express = require('express');
const router = express.Router();
const { getRecords,                            // wieso {} ????????????
    addRecord,
    getRecord,
    deleteRecord,
    updateRecord
} = require('../controllers/recordsController');


/** GET all the records */
router
    .route('/')
    .get(getRecords)
    .post(addRecord);

router
    .route('/:id')
    .get(getRecord)
    .delete(deleteRecord)
    .put(updateRecord);

/** POST a new record */
router.post('/', addRecord);

module.exports = router;