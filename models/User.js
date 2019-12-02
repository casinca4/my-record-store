const mongoose = require('mongoose');
const { Schema } = mongoose;
const Address = require('./Address');                         //import Schema
//das gleiche: 
//  var Schema = mongoose.Schema;

//Schema

const UserSchema = new Schema(
  {
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
    address: {
      type: Address,
      required: true
    },
    tokens: [
      {
        access: {
          type: String,
          required: true
        },
        token: {
          type: String,
          required: true
        }
      }
    ]
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
    .sign({ _id: user._id.toHexString(), access }, 'babylon')   //id muß string sein; babylon: secret key
    .toString;
  // console.log(token);

  // user.tokens.push({            // store token inside the DB; pushes token in model
  //   access,                 // access: access,
  //   token                   // token: token
  // });

  user.tokens.push({ access, token });
  
  return token;
};

// decode token
UserSchema.statics.findByToken = function (token) {       // UserSchema has place to write statics methods or methods methods <-- talks to the specific user you are talking to, not to the model
  const User = this;            // this refers to the model

  try {
    const decoded = jwt.verify(token, 'babylon');     // jwt oben benutzt; was gedruckt wird: in ucontrollers
  } catch (err) {
    return;
  };


  // return User.findOne({     // returns a promise; auch andere methods, wie find
  //   _id: decoded._id,
  //   tokens: [{
  //     token: token,
  //     access: decoded.access
  //   }]
  // });

  //oder so:

  return User.findOne({     // wenn er einen user findet, we get back all the information of the user
    _id: decoded._id,
    'tokens.token': token,
    'tokens.access': decoded.access
  });
};

module.exports = mongoose.model('User', UserSchema);        //User should contain UserSchema



//module is wie class, Schema is wie constructor



 //wenn required true nicht angegeben, dann ist es automatisch false