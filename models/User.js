const mongoose = require('mongoose');
const { Schema } = mongoose;
const Address = require('./Address');   // import schema
const jwt = require('jsonwebtoken');
const encryption = require('../lib/encryption');
const env = require('../config/config');
//das gleiche: 
//  var Schema = mongoose.Schema;

//Schema

const UserSchema = new Schema(
  {
    id: false,
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    birthday: {
      type: Date
    },
    userName: {
      type: String,
      required: true,
      unique: true
    },
    role: {
      type: String,
      enum: ['Admin', 'User'],
      required: true
    },
    address: {
      type: Address,
      required: true
    }
  },
  {
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    }
  }
);

UserSchema.virtual('fullName').get(function () {
  return this.firstName + ' ' + this.lastName;
});


// console.log(UserSchema);
UserSchema.methods.generateAuthToken = function () {
  const user = this;                                      // this: UserSchema; Schema ist das obere in postman post user
  const access = 'x-auth';

  const token = jwt
    .sign({ _id: user._id.toHexString(), access }, env.jwt_key)   //id muß string sein; babylon: secret key
    .toString;
  // console.log(token);

  // user.tokens.push({            // store token inside the DB; pushes token in model
  //   access,                 // access: access,
  //   token                   // token: token
  // });

  return token;
};

UserSchema.methods.checkPassword = async function (password) {
  const user = this;
  return await encryption.compare(password, user.password);
};

UserSchema.methods.getPublicFields = function () {
  return {
    _id: this._id,
    lastName: this.lastName,
    firstName: this.firstName,
    email: this.email,
    fullName: this.fullName,
    birthday: new Date(this.birthday),
    address: this.address
  };
};


// decode token
UserSchema.statics.findByToken = function(token) {    // UserSchema has place to write statics methods or methods methods <-- talks to the specific user you are talking to, not to the model
  const User = this;            // this refers to the model
  let decoded;

  try {
    decoded = jwt.verify(token, env.jwt_key);   // jwt oben benutzt; was gedruckt wird: in ucontrollers
  } catch (err) {
    return;
  }

   // return User.findOne({     // returns a promise; auch andere methods, wie find
  //   _id: decoded._id,
  //   tokens: [{
  //     token: token,
  //     access: decoded.access
  //   }]
  // });

  //oder so:


  return User.findOne({       // wenn er einen user findet, we get back all the information of the user
    _id: decoded._id
  });
};



 


UserSchema.pre('save', async function (next) {
  // only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  this.password = await encryption.encrypt(this.password);     // this: schema
  next();
});

module.exports = mongoose.model('User', UserSchema);        //User should contain UserSchema



//module is wie class, Schema is wie constructor



 //wenn required true nicht angegeben, dann ist es automatisch false