const mongoose = require('mongoose');

// var conn = mongoose.createConnection('mongodb+srv://Balar123:balar123@cluster0.p9llm3p.mongodb.net/?retryWrites=true&w=majority');

const payment_data = new mongoose.Schema({
    
    pay_number:{
        type:String
    },
    pat_name:{
        type:String
    },
    doc_name:{
        type:String
    },
    pay_date:{
        type:String
    },
    tot_amount:{
        type:String
    },
    Discount:{
        type:String
    },
    pay_method:{
        type:String
    }
    
  });

  const payments_model = mongoose.model('payment', payment_data);
// var Basic_Information_model = conn.model('Basic_Information', basic_data);

  module.exports = payments_model;