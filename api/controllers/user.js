const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const User = require("../models/user");

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
            .then((result) => {
            //     transport.sendMail({
            //         from: '"hamza el mekkoudi 👻" <foo@example.com>', // sender address
            //         to: userBody.email, // list of receivers
            //         subject: "Hello ✔", // Subject line
            //         text: "Hello world?", // plain text body
            //         html: "<b>Hello world?</b>", // html body
            //    }).then(data => {
            //        console.log(data)
            //        res.status(200).json({message: "User created with success!"});
            //    }).catch(err => {
            //     console.log(err)

            //        res.status(500).json({
            //            error: err.message
            //        })
            //    })
              res.status(200).json({message: "User created with success!"});
               const msg = {
                to: result.email, // Change to your recipient
                from: 'hazard_cfc@outlook.fr', // Change to your verified sender
                subject: 'Sending with SendGrid is Fun',
                // text: 'and easy to do anywhere, even with Node.js',
                html: '<h1>and easy to do anywhere, even with Node.js</h1>',
              }
            return sgMail
                .send(msg)
                .then(() => {
                  console.log('Email sent')
                })
                .catch((error) => {
                  console.error(error)
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