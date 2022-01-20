const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.user_signup = (req, res, next) => {
    const userBody = req.body;
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
                res.status(200).json({message: "User created with success!"});
            })
            .catch(err => {
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