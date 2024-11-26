const { Router } = require("express");
const route = new Router();
const passport = require("passport");
const customer = require("../schemas/customer.js");
const nodemailer = require("nodemailer");

const bcrypt = require("bcryptjs");

route.post("/checkLogin", passport.authenticate("local"), async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    res.send(err);
  }
});

route.post("/newCustomer", async (req, res) => {
  try {
    const salt = bcrypt.genSaltSync();
    let { name, email, password } = req.body;
    password = bcrypt.hashSync(password, salt);
    await customer.create({ name, password, email });
    res.sendStatus(200);
  } catch (err) {
    res.send(err);
  }
});

route.post("/deleteCustomer", async (req, res) => {
  try {
    const { customerID } = req.body;
    await customer.findOneAndDelete({ _id: customerID });
    req.session.destroy();
    res.sendStatus(200);
  } catch (err) {
    res.send(err);
  }
});
route.post("/email", async (req, res) => {
  try {
    const { email } = req.body;
    const customer1 = await customer.findOne({ email: email });
    if (customer1) {
      res.send(customer1._id);
    } else {
      res.send(201);
    }
  } catch (err) {
    res.send(err);
  }
});
route.post("/changePassword", async (req, res) => {
  try {
    let { id, newPassword } = req.body;
    const salt = bcrypt.genSaltSync();
    newPassword = bcrypt.hashSync(newPassword, salt);
    await customer.updateOne({ _id: id }, { password: newPassword });
    res.sendStatus(200);
  } catch (err) {
    res.send(err);
  }
});

route.post("/sendVerfnumber", async (req, res) => {
  try {
    const { receverMail, verfNumber } = req.body;
    // console.log(receverMail, verfNumber);
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "samdtc931@gmail.com",
        pass: "pdwr dkza xkaj przx",
      },
    });
    var mailOptions = {
      from: "dontreply",
      to: receverMail,
      subject: "CVMK24 OTP",
      text: "your verfication number : " + verfNumber,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        // console.log(error);
        res.send(404);
      } else {
        res.send(200);
        // console.log("Email sent: " + info.response);
      }
    });
  } catch (err) {
    throw err;
  }
});
// route.get("/getCustomer/:id", async (req, res) => {
//   try {
//     res.send(await customer.findById(req.params.id));
//   } catch (err) {
//     res.send(err);
//   }
// });

module.exports = route;
