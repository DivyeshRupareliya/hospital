var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
var nodemailer = require("nodemailer");
const storage = require("node-persist"); // for stor login id
const mongoose = require("mongoose");
var sign_up_model = require("../model/sign_up");
var book_appointment_model = require("../model/book_appointment");

var collection;

mongoose.connect(
  // "mongodb+srv://divyeshr1:Divyesh123@cluster0.54rclfu.mongodb.net/?retryWrites=true&w=majority",         //Atlast link
  "mongodb://127.0.0.1:27017/hospital",
  async function (err, db) {
    collection = await db.collection("basic_informations");
  }
);

/* GET home page. */
router.get("/", async function (req, res, next) {
  await storage.init();
  var id = await storage.getItem("user_id");

  if (typeof id === "undefined") {
    res.redirect("index");
  } else {
    res.redirect("home");
  }

  res.render("index", { title: "Express" });
});

router.get("/index", async function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/home", async function (req, res, next) {
  await storage.init();
  collection.find().toArray(async function (err, data) {
    console.log(data);
    var profile = await storage.getItem("user_name");
    console.log("profile");
    console.log(profile);
    res.render("home", { data, profile });
  });
});

//*********************** */Start Sign_up page router
router.get("/sign_up", function (req, res, next) {
  res.render("sign_up", { title: "Express" });
});

router.post("/sign_up", async function (req, res, next) {
  var email = req.body.user_email;

  var email_find = await sign_up_model.find({ user_email: email });

  if (email_find == "") {
    var bcrypt_pass = await bcrypt.hash(req.body.user_password, 10);

    var obj = {
      user_name: req.body.user_name,
      user_email: req.body.user_email,
      user_phone: req.body.user_phone,
      user_password: bcrypt_pass,
    };
    await sign_up_model.create(obj);
    res.redirect("sign_in");
  } else {
    res.send("Email id allready Existing");
  }
});
//*********************** */Close Sign_up page router

//*********************** */Start Sign_in page router
router.get("/sign_in", function (req, res, next) {
  res.render("sign_in", { title: "Express" });
});

router.post("/sign_in", async function (req, res) {
  await storage.init();

  var check_mail = req.body.user_email;

  var hash = await sign_up_model.find({ user_email: check_mail });

  if (hash != "") {
    var password = req.body.user_password;
    bcrypt.compare(
      password,
      hash[0].user_password,
      async function (err, result) {
        // result == true
        if (result == true) {
          await storage.setItem("user_id", hash[0]._id);
          await storage.setItem("user_name", hash[0].user_name);
          res.redirect("home");
        } else {
          res.send("please check your password");
        }
      }
    );
  } else {
    res.send("please check email id");
  }
});
//*********************** */Close Sign_in page router

//*********************** */Start forgot_password page router
router.get("/forgot_password", function (req, res) {
  res.render("forgot_password");
});

router.post("/forgot_password", async function (req, res) {
  await storage.init();

  var send_mailid = req.body.user_email;

  var gen_otp = Math.floor(1000 + Math.random() * 9000);
  var otp = gen_otp.toString();
  await storage.setItem("otp", otp);
  await storage.setItem("mail", send_mailid);

  var find_mail = await sign_up_model.find({ user_email: send_mailid });

  if (find_mail != "") {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "divubhai36@gmail.com",
        pass: "awmwhsuldczyflys",
      },
    });

    var mailOptions = {
      from: "divubhai36@gmail.com",
      to: send_mailid,
      subject: "Oreo Hospital, Forgot Password OTP",
      text: "WEL-COME, Thank-you to Join Us",
      html: `<h1>${otp}</h1>
          <p>Please Verify And Do Not share this otp</p>
           `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
        res.redirect("otp");
      }
    });
  } else {
    res.send("please check your mail id");
  }
});

//*********************** */Close forgot_password page router

//*********************** */Start otp page router

router.get("/otp", function (req, res) {
  res.render("otp");
});

router.post("/otp", async function (req, res) {
  await storage.init();

  var user_otp = req.body.user_otp;

  var store_otp = await storage.getItem("otp");

  if (store_otp == user_otp) {
    res.redirect("set_password");
  } else {
    res.send("please enter otp");
  }
});

//*********************** */Close otp page router

//*********************** */Start set password page router

router.get("/set_password", async function (req, res) {
  await storage.init();
  var msg = await storage.getItem("update_password");
  res.render("set_password", { msg });
});

router.post("/set_password", async function (req, res) {
  await storage.init();

  var new_pass = req.body.user_new_password;
  var con_pass = req.body.user_confirm_password;

  var mailid = await storage.getItem("mail");

  const filter = { user_email: mailid };

  if (new_pass == con_pass) {
    var bcrypt_pass = await bcrypt.hash(new_pass, 10);
    const update = { user_password: bcrypt_pass };

    let doc = await sign_up_model.findOneAndUpdate(filter, update);

    if (typeof doc === undefined) {
      await storage.setItem("update_password", "fail");
      res.redirect("set_password");
    } else {
      res.redirect("sign_in");
    }
  }
});

//*********************** */Close set password page router

//*********************** */Start Logout page router

router.post("/logout", async function (req, res) {
  await storage.init();
  await storage.clear();

  res.redirect("index");
});

//*********************** */Close Logout page router

//*********************** */Start Logout page router

router.get("/book_appointment", async function (req, res) {
  res.redirect("home");
});

router.post("/book_appointment", async function (req, res) {
  var obj = {
    pat_fname: req.body.pat_fname,
    pat_lname: req.body.pat_lname,
    pat_age: req.body.pat_age,
    sel_doctor: req.body.sel_doctor,
    sel_department: req.body.sel_department,
    pat_number: req.body.pat_number,
    pat_apoi_date: req.body.pat_apoi_date,
    pat_email: req.body.pat_email,
  };

  var submited = req.body.sent;
  var sentmailid = obj.pat_email;
  var docname = obj.sel_doctor;
  var deptname = obj.sel_department;
  var apoidate = obj.pat_apoi_date;
  var pat_fname = obj.pat_fname;
  var pat_lname = obj.pat_lname;

  var hello = docname.toString();
  var hello2 = deptname.toString();
  var hello3 = apoidate.toString();
  var hello4 = pat_fname.toString();
  var hello5 = pat_lname.toString();

  console.log("hello");
  console.log(hello);

  if (submited == "submit") {
    if (sentmailid != "") {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "divubhai36@gmail.com",
          pass: "awmwhsuldczyflys",
        },
      });

      var mailOptions = {
        from: "divubhai36@gmail.com",
        to: sentmailid,
        subject: "Online apooiment",
        text:
          " Patient Name : " +
          hello4 +
          hello5 +
          "\n Doctor Name : " +
          hello +
          "\n Department Name : " +
          hello2 +
          "\n Appointment Date : " +
          hello3 +
          "\n Your Appointment Has Been Panding",

      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
        res.redirect("home");
      });
    }
  }

  book_appointment_model.create(obj);

  res.redirect("home");
});

//*********************** */Close Logout page router

module.exports = router;
