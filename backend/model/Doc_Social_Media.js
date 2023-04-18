const mongoose = require('mongoose');

// var conn = mongoose.createConnection('mongodb+srv://Balar123:balar123@cluster0.p9llm3p.mongodb.net/?retryWrites=true&w=majority');

const social_data = new mongoose.Schema({
    
    soc_facebook:{
        type:String
    },
    soc_twitter:{
        type:String
    },
    soc_google_plus:{
        type:String
    },
    soc_linkdin:{
        type:String
    },
    soc_behance:{
        type:String
    },
    soc_dribbble:{
        type:String
    },
    food:{
        type:String
    }

  });

  const Doc_Social_Media_model = mongoose.model('Doc_Social_Media', social_data);
// var Doc_Social_Media_model = conn.model('Doc_Social_Media', social_data);

  module.exports = Doc_Social_Media_model;