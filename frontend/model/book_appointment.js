const mongoose = require('mongoose');


const book_appointment_data = new mongoose.Schema({
    pat_fname:{
        type:String
    },
    pat_lname:{
        type:String
    },
    pat_age:{
        type:String
    },
    sel_doctor:{
        type:String
    },
    sel_department:{
        type:String
    },
    pat_number:{
        type:String
    },
    pat_apoi_date:{
        type:String
    },
    pat_email:{
        type:String
    }
    

  });

  const book_appointment_model = mongoose.model('book_appointment', book_appointment_data);

  module.exports = book_appointment_model;