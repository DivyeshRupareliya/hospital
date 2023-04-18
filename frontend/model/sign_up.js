const mongoose = require('mongoose');


const sign_up_data = new mongoose.Schema({
    user_name:{
        type:String
    },
    user_email:{
        type:String
    },
    user_phone:{
        type:String,
        required:true,
    },
    user_password:{
        type:String
    }
  });

  const sign_up_model = mongoose.model('sign_up_user', sign_up_data);

  module.exports = sign_up_model;