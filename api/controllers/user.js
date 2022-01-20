const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

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