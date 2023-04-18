const mongoose = require('mongoose');

const account_data = new mongoose.Schema({

    account_username:{
        type:String
    },
    account_password:{
        type:String
    },
    account_confirm_password:{
        type:String
    }
  });

  const Doc_Account_model = mongoose.model('Doc_Account_Information', account_data);

  module.exports = Doc_Account_model;