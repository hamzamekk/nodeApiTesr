const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product')

router.get('/', (req, res, next) => {
   Product.find()
   .then(docs => {
       res.status(200).json(docs);
   })
   .catch(err => {
    res.status(500).json({error: err.message})
   })
})


router.post('/', (req, res, next) => {
    const product = new Product({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
    })
     product
     .save()
     .then(result => {
         console.log(result);
         res.status(201).json(result)
        })
     .catch(err => {
         console.log(err)
         res.status(500).json({error: err.message})
        })
  })

  router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;

    Product.findById(id)
    .then(doc => { 
        console.log(doc)
        res.status(200).json(doc);
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error: err.message})
    })
  })
  

  router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;

    Product.updateOne({_id : id}, {$set: {...req.body}})
    .then(result => {
        res.status(201).json(result)
    })
    .catch(err => {
        res.status(500).json({error: err.message})
    })
  })

  router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;

    Product.deleteOne({_id : id})
    .then(result => {
        res.status(201).json(result)
    })
    .catch(err => {
        res.status(500).json({error: err.message})
    })
  })
  

  module.exports = router;