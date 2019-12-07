const User = require('../models/User');       //User groß weil class, ist model
const createError = require('http-errors');

exports.getUsers = async (req, res, next) => {      //await immer mit async; mit try und catch; req ist nicht notwendig
  // const users = db.get('users').value();
  try {
    const users = await User.find()        //talking to the db (mongoose), da model User; find will never fail, höchstens empty array
      .sort('lastName')
      .select('-password -__v -tokens._id');
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
    // What happens when an Admin want to delete a User's account??
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) throw new createError.NotFound();
    res
      .status(200)
      .send(user)
      .select('-password');
  } catch (e) {
    next(e);
  }
};

exports.updateUser = async (req, res, next) => {
  console.log(req.body);
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {    //params: bei postman http://localhost:3000/users
      new: true,                                      //2.: was wir updaten möchten
      runValidators: true                         //aus mongoose documentation
    });
    if (!user) throw new createError.NotFound();
    const data = user.getPublicFields();
    res.status(200).send(user);
  } catch (e) {
    next(e);
  }
};

exports.addUser = async (req, res, next) => {
  try {
    const user = new User(req.body);     //req.body entspricht data
    const token = user.generateAuthToken();
    await user.save();
    const data = user.getPublicFields();
    res
      .status(200)
      .header('x-auth', token)
      .send(data);   // put token in the header
  } catch (e) {
    next();
  }
};

exports.loginUser = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email });
    console.log(user);
    const token = user.generateAuthToken();
    const canLogin = await user.checkPassword(password);
    if (!canLogin) throw new createError.NotFound();
    const data = user.getPublicFields();

    res
      .status(200)
      .header('x-auth', token)
      .send(data);
  } catch (e) {
    next(e);
  }
};


exports.authenticateUser = async (req, res, next) => {   // in route in users.js benutzt
  // console.log(req);
  res.status(200).send(req.user);
  // try {
  //   const token = req.header('x-auth');
  //   const user = await User.findByToken(token);
  //   if (!user) throw new createError.NotFound();
  //   res.send.status(200).send(user);      // wenn authentication geklappt hat; validate auth.
  // } catch (e) {
  //   next(e);
  // }
}



//new true: return the updated document 