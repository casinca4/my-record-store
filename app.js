// all das ist Standard

/** EXTERNAL DEPENDENCIES */

const express = require('express');
const path = require('path');         // get path of files    z. B. path.name vielleicht; bei static files
const cookieParser = require('cookie-parser');  // benutzen wir nicht; read cookies wie z. B. read local storage
const logger = require('morgan');       // for creating logs;  was man im Terminal sieht
const mongoose = require('mongoose');


/** ROUTERS */
//  A router object is an isolated instance of middleware and routes. You can think of it as a “mini-application,” capable only of performing middleware and routing functions. Every Express application has a built-in app router.
// http://expressjs.com/de/4x/api.html#router

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const recordsRouter = require('./routes/records');
const ordersRouter = require('./routes/orders');


/** OUR MIDDLEWARE */
const { setCors } = require('./middleware/security');   // cross origin request.... request that come from somewhere else
const env = require('./config/config');


/** INIT THE SERVER */
const app = express();


/** LOGS */
app.use(logger('dev'));


/** CONNECT TO MONGO */
mongoose.connect('mongodb://localhost:27017/MyRecordStore', {       //27017 sieht man in mongo compass ind localhost; MyRecordStore oder irgendein anderer Name, ist Name der Datenbank
  useNewUrlParser: true,                        //die drei Zeilen kamen als Info im Terminal, wenn sie auskommentiert sind
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

mongoose.connection.on(
  'error',
  console.error.bind(console, 'connection error:')
);

mongoose.connection.on('open', () => {
  console.log(`Connected to the database...`);
});

//Anweisungen von hier: https://mongoosejs.com/docs/index.html


/** REQUEST PARSERS */  
//müssen standargmäßig da sein
//runs every time           sind middleware functions; immer wenn use
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(setCors);           //wenn hier error, geht es trotzdem weiter; man braucht extra middleware function; middleware function ; die haben wir geschrieben


/** STATIC FILES */
app.use(express.static(path.join(__dirname, 'public')));


/** ROUTES */
app.use('/', indexRouter);      // s. oben bei routers
app.use('/users', usersRouter);
app.use('/records', recordsRouter);       //we point people to the pointer recordsRouter          
app.use('/orders', ordersRouter);

//wenn alles gut ist, geht es einen WEg; wenn irgendwas falsch ist in Router, controller oder so, dann geh zur nächsten middleware function, s. error handling


/** ERROR HANDLING */
/* wenn hier in Datei was falsch ist, wird diese Funktion angewendet; z. B. const usersRouter = require('./routes/users'); man gibt in Adresse usersklj ein; geht also chronologisch; wir haben bis jetzt nichts anderes programmiert
object inside an object: Antwort wird immer res.data.error sein und nicht res.data.message; deswegen nicht message: ...
*/

app.use(function (req, res, next) {    //next talks to all middleware function, s. ROUTES and calls the next one
  const err = new Error('Looks like something is broken...');     //err könnte auch anders heißen und unten in der Funktion trotzdem err; er erkennt das
  next(err);            //geht zur nächsten function dadrunter
});

// warum error hier und nicht unteN???????????????

app.use(function (err, req, res, next) {
  res.status(400).send({
    error: {
      message: err.message                  //message: 'Looks like something is broken...'
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



//https://mongoosejs.com/docs/populate.html#populate-virtuals   für populate
//https://mongoosejs.com/docs/guide.html      für virtual