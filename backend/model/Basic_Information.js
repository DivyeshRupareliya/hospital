const mongoose = require('mongoose');

// var conn = mongoose.createConnection('mongodb+srv://Balar123:balar123@cluster0.p9llm3p.mongodb.net/?retryWrites=true&w=majority');

const basic_data = new mongoose.Schema({

    doc_fname:{
        type:String
    },
    doc_lname:{
        type:String
    },
    doc_dob:{
        type:String
    },
    doc_gender:{
        type:String
    },
    doc_speciality:{
        type:String
    },
    doc_phone:{
        type:String
    },
    doc_email:{
        type:String
    },
    doc_weburl:{
        type:String
    },
    doc_textarea:{
        type:String
    },
    doc_image:{
        type:String
    }

  });

  const Basic_Information_model = mongoose.model('Basic_Information', basic_data);

  module.exports = Basic_Information_model;