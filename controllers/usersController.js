const User = require('../models/User');       //User groß weil class, ist model
const createError = require('http-errors');

exports.getUsers = async (req, res, next) => {      //await immer mit async; mit try und catch; req ist nicht notwendig
  // const users = db.get('users').value();
  try {
    const users = await User.find();        //talking to the db (mongoose), da model User; find will never fail, höchstens empty array
    res.status(200).send(users);
  } catch (e) {                   //wenn Fehler
    next(e);                      //something went wrong; geht zur nächsten; oder ohne e; geht zur app.js error handling
  }
};

//nicht low db, sondern mongoose
exports.getUser = async (req, res, next) => {
    try {
    const user = await User.findById(req.params.id);   //in db gucken
    if (!user) throw new createError.NotFound();
    res.status(200).send(user);
  } catch (e) {
    next();
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) throw new createError.NotFound();
    res.status(200).send(user);
  } catch (e) {
    next(e);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {    //params: bei postman http://localhost:3000/users
      new: true                                       //2.: was wir updaten möchten
    });
    if (!user) throw new createError.NotFound();
    res.status(200).send(user);
  } catch (e) {
    next(e);
  }
};

exports.addUser = async (req, res, next) => {
  try {
    const user = new User(req.body);     //req.body entspricht data
    await user.save();
    res.status(200).send(user);
  } catch (e) {
    next();
  }
};