 const mongoose = require('mongoose');
 const { Schema } = mongoose;
 //das gleiche: 
 //  var Schema = mongoose.Schema;

 //Schema

 const UserSchema = new Schema ({
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
         required:true
     },
     birthday: {
         type: Date
     },
     userName: {
         type: String,
         required: true,
         unique: true
     }
 });



module.exports = mongoose.model("User", UserSchema);         //User should contain UserSchema



//module is wie class, Schema is wie constructor







 //wenn required true nicht angegeben, dann ist es automatisch false