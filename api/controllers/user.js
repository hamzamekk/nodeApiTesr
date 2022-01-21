const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');

const User = require("../models/user");



var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "66b89d010a11e8",
      pass: "eb66a61007f758"
    }
  });

exports.user_signup = (req, res, next) => {
    const userBody = req.body;
    console.log(userBody);
    bcrypt.hash(userBody.password, 10 , (err, hash) => {
        if(err) {
            return res.status(500).json({
                message: err.message
            })
        } else {
            const user = new User({_id: mongoose.Types.ObjectId(), ...userBody, ...{password: hash}});
            user
            .save()
            .then(() => {
                transport.sendMail({
                    from: '"hamza el mekkoudi 👻" <foo@example.com>', // sender address
                    to: userBody.email, // list of receivers
                    subject: "Hello ✔", // Subject line
                    text: "Hello world?", // plain text body
                    html: "<b>Hello world?</b>", // html body
               }).then(data => {
                   console.log(data)
                   res.status(200).json({message: "User created with success!"});
               }).catch(err => {
                console.log(err)

                   res.status(500).json({
                       error: err.message
                   })
               })
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({message: err.message})
            })
        } 
    })
}
exports.user_login = (req, res, next) => {
    const BodyUser = req.body;
    User.findOne({email: BodyUser.email})
    .then(user => {
        bcrypt.compare(BodyUser.password, user.password, ((err, result) => {    
            console.log(err)           
            if(result) {
                const token = jwt.sign(
                    {
                      userId: user._id
                    },
                    process.env.JWT_KEY,
                    {
                      expiresIn: "1h"
                    }
                  );

                  return res.status(200).json({
                    token
                  });
                }            
            return res.status(401).json({
                message: "Auth failed"
              });
        }))
    }).catch(error => {
        console.log(error)
        return res.status(500).json({
            message:  error.message,
        })
    })
}