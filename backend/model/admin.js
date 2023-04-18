const mongoose = require('mongoose');

// var conn = mongoose.createConnection('mongodb+srv://Balar123:balar123@cluster0.p9llm3p.mongodb.net/?retryWrites=true&w=majority');

const admin_data = new mongoose.Schema({

    admin_email:{
        type:String
    },
    admin_password:{
        type:String
    }
  });

  const admin_model = mongoose.model('admin', admin_data);
  // var admin_model = conn.model('admin', admin_data);

  module.exports = admin_model;