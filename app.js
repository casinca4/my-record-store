/** EXTERNAL DEPENDENCIES */

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const mongoose = require('mongoose');


/** ROUTERS */

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const recordsRouter = require('./routes/records');     
const ordersRouter = require('./routes/orders');


/** OUR MIDDLEWARE */
const { setCors } = require('./middleware/security');


/** INIT THE SERVER */
const app = express();


/** LOGS */
app.use(logger('dev'));


/** CONNECT TO MONGO */
mongoose.connect('mongodb://localhost:27017/MyRecordStore', {       //27017 sieht man in mongo compass ind localhost; MyRecordStore oder irgendein anderer Name, ist Name der Datenbank
  useNewUrlParser: true,                        //die drei Zeilen kamen als Info im Terminal, wenn sie auskommentiert sind
  useCreateIndex: true,
  useUnifiedTopology: true
});

mongoose.connection.on(
  'error',
  console.error.bind(console, 'connection error:')
);

mongoose.connection.on('open', () => {
  console.log(`Connected to the database...`);
});

//Anweisungen von hier: https://mongoosejs.com/docs/index.html




/** SET UP LOWDB */             //Anweisungen von github lowdb; lowdb gibt es bald nicht mehr
const adapter = new FileSync('data/db.json');           //diese und nächste Zeile: connects things together
const db = low(adapter);
db.defaults({ records: [], users: [], orders: [] }).write();        //das geht zu db eine Zeile darüber, adapter zu db.json; deswegen infinite loop, wenn in db.json nicht verhindert in start


/** REQUEST PARSERS */  
//runs every time           sind middleware functions
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(setCors);           //wenn hier error, geht es trotzdem weiter; man braucht extra middleware function


/** STATIC FILES */
app.use(express.static(path.join(__dirname, 'public')));


/** ROUTES */
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/records', recordsRouter);              
app.use('/orders', ordersRouter);


/** ERROR HANDLING */
/* wenn hier in Datei was falsch ist, wird diese Funktion angewendet; z. B. const usersRouter = require('./routes/users'); man gibt in Adresse usersklj ein; geht also chronologisch; wir haben bis jetzt nichts anderes programmiert
object inside an object: Antwort wird immer res.data.error sein und nicht res.data.message; deswegen nicht message: ...
*/

app.use(function(req, res, next) {
    const err = new Error('Looks like something is broken...');     //err könnte auch anders heißen und unten in der Funktion trotzdem err; er erkennt das
    next(err);
});

app.use(function(err, req, res, next) {
    res.status(400).send({
        error: {
            message: err.message
        }
    });
});



module.exports = app;


//app.js points out to records.js, der points out to the controller, this one gets the data requested


/*
records: router.route('/')      // / = records (local)
recordsController       find ({id: id}) ... 2. id ist von const {id}        find ist fake object
find an object that has an ID of 25, wenn const id = 25    const record = db .get ... .find ({id}) --> id : id
*/