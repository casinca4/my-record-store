/** EXTERNAL DEPENDENCIES */

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');


/** ROUTERS */

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const recordsRouter = require('./routes/records');      //haben wir hinzugefügt
const ordersRouter = require('./routes/orders');


/** OUR MIDDLEWARE */
const { setCors } = require('./middleware/security');


/** INIT THE SERVER */
const app = express();


/** LOGS */
app.use(logger('dev'));


/** SET UP LOWDB */             //Anweisungen von github lowdb
const adapter = new FileSync('data/db.json');           //diese und nächste Zeile: connects things together
const db = low(adapter);
db.defaults({ records: [], users: [], orders: [] }).write();        //das geht zu db eine Zeile darüber, adapter zu db.json; deswegen infinite loop, wenn in db.json nicht verhindert in start


/** REQUEST PARSERS */
//runs every time
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(setCors);


/** STATIC FILES */
app.use(express.static(path.join(__dirname, 'public')));


/** ROUTES */
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/records', recordsRouter);              //haben wir hinzugefügt
app.use('/orders', ordersRouter);

module.exports = app;


//app.js points out to records.js, der points out to the controller, this one gets the data requested


/*
records: router.route('/')      // / = records (local)
recordsController       find ({id: id}) ... 2. id ist von const {id}        find ist fake object
find an object that has an ID of 25, wenn const id = 25    const record = db .get ... .find ({id}) --> id : id
*/