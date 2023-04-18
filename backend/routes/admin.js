var express = require('express');
var router = express.Router();
const storage = require('node-persist');
const multer = require('multer');
const mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var admin_model = require('../model/admin')
var Basic_Information_model = require('../model/Basic_Information');
var Doc_Account_model = require('../model/Doc_Account_Information');
var Doc_Social_Media_model = require('../model/Doc_Social_Media');
var book_appointment_model = require('../model/book_appointment');
var payments_model = require('../model/payment');

var collection ;
// mongoose.connect('mongodb+srv://divyeshr1:Divyesh123@cluster0.54rclfu.mongodb.net/?retryWrites=true&w=majority',async function(err, db) {
mongoose.connect('mongodb://127.0.0.1:27017',async function(err, db) {
collection = await db.collection('basic_informations');
});

var storage1 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uplode')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

var upload = multer({ storage: storage1 })


/* GET home page. */

// ************************************ Start Login page
router.get('/',async function(req, res, next) {

  await storage.init();

  var id =  await storage.getItem('user_id');

  if(typeof id === 'undefined')
  {
    res.redirect('sign_in')
  }
  else
  {
    res.redirect('index')
  }

});

router.post('/',async function(req, res, next) {

  await storage.init();

  var email = req.body.admin_email;
  var password = req.body.admin_password;

  var checkmail = await admin_model.find({admin_email:email});

  console.log(checkmail);

  if(checkmail!='')
  {
    if(checkmail[0].admin_password==password)
    {
      await storage.setItem('user_id',checkmail[0]._id);
      res.redirect('index')
    }
    else
    {
      res.send('please check password')
    }
  }
  else
  {
    res.send('please check email id')
  }
});
// ************************************ End Login page



// ************************************ Start sign_in page
router.get('/sign_in', function(req, res, next) {
  res.render('sign_in', { title: 'Express' });
});
// ************************************ Close sign_in page


// ************************************ Start Index page
router.get('/index',async function(req, res, next) {

  await storage.init();
  var id =  await storage.getItem('user_id');

  if(id=='')
  {
    res.redirect('/');
  }

  var user_details = await admin_model.find({_id:id});

  console.log(user_details);

  var email = user_details[0].admin_email;
  await storage.setItem('email',email);

  res.render('index', {email});
  // res.render('book_appointment', { title: 'email',email});
});
// ************************************ Close Index page



// ************************************ Start Appointment page
router.get('/book_appointment', async function(req, res, next) {
  await storage.init();
  var email = storage.getItem('email');

  collection.find().toArray(async function(err, data) {

    console.log(data);
    res.render('book_appointment', { title: 'Express',email,data});

  });

});

router.post('/book_appointment', async function(req, res, next) {

  var obj = {
    pat_fname:req.body.pat_fname,
    pat_lname:req.body.pat_lname,
    pat_age:req.body.pat_age,
    sel_doctor:req.body.sel_doctor,
    sel_department:req.body.sel_department,
    pat_number:req.body.pat_number,
    pat_apoi_date:req.body.pat_apoi_date,
    pat_email:req.body.pat_email
  }

  book_appointment_model.create(obj);


  // var email_id = req.body.search_id;

  // var find_email = await book_appointment_model.find({pat_email:email_id});

  // if(find_email!='')
  // {
  //   res.redirect('book_appointment');
  // }
  // else
  // {
  //   res.redirect('rescheduled')
  // }

  res.redirect('book_appointment')


});
// ************************************ Close Appointment page


// ************************************ Start All_Appointment page
router.get('/All_appoiment',async function(req, res, next) {
  await storage.init();

  var email = storage.getItem('email');

  collection.find().toArray(async function(err, data) {

    var pat = await book_appointment_model.find();
    res.render('All_appoiment', { title: 'Express',email,data,pat});

  });

});

router.post('/All_appoiment',async function(req, res) {

  var mailid = req.body.sent;

  console.log("***************");
  console.log(mailid);

  var all_info = await book_appointment_model.find({pat_email:mailid});
  var id = all_info[0]._id;
  const srch = {
    _id:id
  }
  const update_status = {
    __v:"1"
  }
  await book_appointment_model.findByIdAndUpdate(srch,update_status)

  var data1 = all_info[0].sel_doctor;
  var data2 = all_info[0].sel_department;
  var data3 = all_info[0].pat_apoi_date;
  var data4 = all_info[0].pat_fname;
  var data5 = all_info[0].pat_lname;

  var hello = data1.toString();
  var hello2 = data2.toString();
  var hello3 = data3.toString();
  var hello4 = data4.toString();
  var hello5 = data5.toString();

  if(mailid!='')
  {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'divubhai36@gmail.com',
          pass: 'awmwhsuldczyflys'
        }
      });

      var mailOptions = {
        from: 'divubhai36@gmail.com',
        to: mailid,
        subject: 'Online apooiment',
        text: ' PATIENT NAME = '+ hello4 + hello5 + '\n DOCTOR NAME = '+ hello + '\n DEPARTMENT NAME  = ' + hello2 + '\n APPOINTMENT DATE = ' + hello3 + ' \n YOUR APPOINTMENT HAS BEEN CONFIRMED'

      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
        res.redirect('All_appoiment')
      });
  }


});
// ************************************ Close All_Appointment page


// ************************************ Start logout page
router.get('/logout',async function(req, res, next) {

  await storage.init();
  await storage.clear();
  res.redirect('/');
});
// ************************************ Close logout page



// ************************************ Start add_doctor page
router.get('/add_doctor',async function(req,res){
  await storage.init();
  var email = storage.getItem('email');

  res.render('add_doctor', { title: 'Express',email });
})

router.post('/add_doctor',upload.single('doc_image'),async function(req, res, next) {

  await storage.init();
  var email = storage.getItem('email');

  const file = req.file

  console.log(file);


    if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
    }

  var obj = {
    doc_fname:req.body.doc_fname,
    doc_lname:req.body.doc_lname,
    doc_dob:req.body.doc_dob,
    doc_gender:req.body.get_value,
    doc_speciality:req.body.doc_speciality,
    doc_phone:req.body.doc_phone,
    doc_email:req.body.doc_email,
    doc_weburl:req.body.doc_weburl,
    doc_textarea:req.body.doc_textarea,
    doc_image:req.file.originalname
  }
  await Basic_Information_model.create(obj);

  res.render('add_doctor', { title: 'Express',email });

});
// ************************************ close add_doctor page



// ************************************ Start all_doctor page
router.get('/all_doctor',async function(req, res, next) {
  await storage.init();
  var email = storage.getItem('email');

  var data = await Basic_Information_model.find();
  console.log(data);

  res.render('all_doctor', { title: 'Express',email,data});
});
// ************************************ close all_doctor page



// ************************************ Start pass page
router.post('/pass', async function(req, res, next) {

  var obj = {
    account_username:req.body.account_username,
    account_password:req.body.account_password,
    account_confirm_password:req.body.account_confirm_password,
  }

  if(obj.account_password == obj.account_confirm_password)
  {
    Doc_Account_model.create(obj);
    res.redirect('add_doctor');
  }
  else
  {
    res.send('please enter same password')
  }

});
// ************************************ Close pass page



// ************************************ Start pass2 page
router.post('/pass2', async function(req, res, next) {

  var obj3 = {

    soc_facebook:req.body.soc_facebook,
    soc_twitter:req.body.soc_twitter,
    soc_google_plus:req.body.soc_google_plus,
    soc_linkdin:req.body.soc_linkdin,
    soc_behance:req.body.soc_behance,
    soc_dribbble:req.body.soc_dribbble,
    food:req.body.food

  }

  Doc_Social_Media_model.create(obj3)

  res.redirect('add_doctor');
});
// ************************************ Close pass2 page


// ********************************* all patients page
router.get('/patients',async function(req, res, next) {
  await storage.init();
  var email = storage.getItem('email');


  var list_pat = await book_appointment_model.find({__v:1});

  console.log('********list pat***********');
  console.log(list_pat);

  res.render('patients', { title: 'Express',email,list_pat});
});

// ********************************* all patients page


// ********************************* start add_patients page
router.get('/add_patient',async function(req, res, next) {
  await storage.init();
  var email = storage.getItem('email');

  collection.find().toArray(async function(err, data) {

    res.render('add_patient', { title: 'Express',email,data});

  });
});

router.post('/add_patient',async function(req, res, next) {

  var obj = {
    pat_fname:req.body.pat_fname,
    pat_lname:req.body.pat_lname,
    pat_age:req.body.pat_age,
    sel_doctor:req.body.sel_doctor,
    sel_department:req.body.sel_department,
    pat_number:req.body.pat_number,
    pat_apoi_date:req.body.pat_apoi_date,
    pat_email:req.body.pat_email
  }

  await book_appointment_model.create(obj);

  var mail = obj.pat_email

  console.log('*************************hello');
  console.log(mail);

  var all_info = await book_appointment_model.find({pat_email:mail});

  console.log('*************************all_info');
  console.log(all_info);

  var id = all_info[0]._id;
  const srch = {
    _id:id
  }
  const update_status = {
    __v:"1"
  }
  await book_appointment_model.findByIdAndUpdate(srch,update_status);

  res.redirect('add_patient');

});

// ********************************* close add_patients page


// ********************************* Start rescheduled page
router.get('/rescheduled',async function(req, res, next) {
  await storage.init();
  var email = storage.getItem('email');
  var emaill = await storage.getItem('email_id');

  collection.find().toArray(async function(err, data) {

    var all_info = await book_appointment_model.find({pat_email:emaill})
    res.render('rescheduled', { title: 'Express',email,data,all_info});

  });
});


router.post('/rescheduled',async function(req, res, next) {
  await storage.init();
  var email = storage.getItem('email');

  var email_id = req.body.search_id;
  await storage.setItem('email_id',email_id);

  var find_email = await book_appointment_model.find({pat_email:email_id});

  if(find_email=='')
  {
    // res.redirect('book_appointment');
    res.send('mail id not found')
  }
  else
  {
    res.redirect('rescheduled')
  }

  res.render('rescheduled', { title: 'Express',email});
});
// ********************************* close rescheduled page


// ********************************* start scheduled update page
router.get('/scheduled_update',async function(req, res, next) {
  await storage.init();
  var email = storage.getItem('email');

  res.render('book_appointment', { title: 'Express',email });
});

router.post('/scheduled_update',async function(req, res, next) {

  await storage.init();
  var email = storage.getItem('email');

  var obj = {
    pat_fname:req.body.pat_fname,
    pat_lname:req.body.pat_lname,
    pat_age:req.body.pat_age,
    sel_doctor:req.body.sel_doctor,
    sel_department:req.body.sel_department,
    pat_number:req.body.pat_number,
    pat_apoi_date:req.body.pat_apoi_date,
    pat_email:req.body.pat_email
  }

  var fname = obj.pat_fname;
  var lname = obj.pat_lname;
  var age = obj.pat_age;
  var doc = obj.sel_doctor;
  var dep = obj.sel_department;
  var num = obj.pat_number;
  var apoi = obj.pat_apoi_date;
  var upmail = obj.pat_email;

  var find_mail = await book_appointment_model.find({pat_email:upmail})
  var id = find_mail[0]._id;

  // console.log('id');
  // console.log(id);

  var search = {
    _id:id
  }

  var update = {
    pat_fname:fname,
    pat_lname:lname,
    pat_age: age,
    sel_doctor: doc,
    sel_department:dep,
    pat_number:num,
    pat_apoi_date:apoi,
    pat_email:upmail
  }

  await book_appointment_model.findByIdAndUpdate(search,update);

  var pat = await book_appointment_model.find();
  res.render('All_appoiment', { title: 'Express',email,pat});
});
// ********************************* Close scheduled update page




// ********************************* start del_pat page

router.get('/patient_profile',async function(req, res, next) {
  await storage.init();
  var email = storage.getItem('email');

  var close_file_pat = await book_appointment_model.find({__v:2});

  res.render('patient_profile', { title: 'Express',email,});
});

router.post('/patient_profile',async function(req, res, next) {

  var file = req.body.close_file;

  var find_file = await book_appointment_model.find({pat_email:file});

  var id = find_file[0]._id;

  var search = {
    _id:id
  }

  var update = {
    __v:"2"
  }

  await book_appointment_model.findByIdAndUpdate(search,update);

  res.redirect('patient_profile');

});

// ********************************* close del_pat page



// ********************************* start add_payments page
router.get('/add_payments',async function(req, res, next) {
  await storage.init();
  var email = storage.getItem('email');

  res.render('add_payments', { title: 'Express',email });
});


router.post('/add_payments',async function(req, res, next) {

  var obj = {
    pay_number:req.body.pay_number,
    pat_name:req.body.pat_name,
    doc_name:req.body.doc_name,
    pay_date:req.body.pay_date,
    tot_amount:req.body.tot_amount,
    Discount:req.body.Discount,
    pay_method:req.body.pay_method
  }

  await payments_model.create(obj);


  res.redirect('add_payments')


});
// ********************************* close add_payments page

// ********************************* start payments page
router.get('/payments',async function(req, res, next) {
  await storage.init();
  var email = storage.getItem('email');

  var pay_info =  await payments_model.find({});

  res.render('payments', { title: 'Express',email,pay_info});
});
// ********************************* Close payments page




module.exports = router;