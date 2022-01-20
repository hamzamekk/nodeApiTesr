const express = require('express');
const app =  express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//routers
const userRoutes = require('./api/routes/user');
const productRoutes = require('./api/routes/product');

mongoose.connect('mongodb+srv://mekk:'+ process.env.MONGO_ATLAS_PW +'@my-node-app.yvvtf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE')
        return res.status(200).json({})
    }
    next();
})

// Routes which should handle requests
app.use("/user", userRoutes);
app.use("/product", productRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message:  error.message,
        }
    })
})


module.exports = app;