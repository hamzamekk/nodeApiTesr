const mongoose = require("mongoose");

//models
const Product = require("../models/product");

exports.get_AllProducts = async (req, res, next) => {
    const {search, limit = 10, offset = 0} = req.query

    const count = await Product.countDocuments();
    // console.log(count);

    console.log("count/offset",Math.ceil(count / limit));

    Product
    .find()
    .limit(limit)
    .skip(offset)
    .then(data => {
        const result = {
            count,
            next: offset / limit >= (count / limit) - 1  ? null : `localhost:3000/product?limit=${limit}&offset=${parseInt(offset) + parseInt(limit)}`,
            previous: offset <= 0 ? null : `localhost:3000/product?limit=${limit}&offset=${parseInt(offset) - parseInt(limit)}`,
            result: data
        }
        return res.status(200).json(result)
    })
    .catch(err => {
        return res.status(500).json({
          message: err.message,
        })
    })
}


exports.creatProduct = (req, res, next) => {
    const product = new Product({
        _id: mongoose.Types.ObjectId(),
        ...req.body,
    })
    product
    .save()
    .then(data => {
       return res.status(200).json(data);
    })
    .catch(err => {
       return res.status(400).json({
            message: err.message,
        })
    })
}

exports.deleteProduct = (req, res, next) => {
    const productId = req.params.productId;
    
    Product
    .deleteOne({_id: productId})
    .then(result => {
        console.log(result);

        if(result.deletedCount > 0){
            res.status(200).json({
                message: "Product deleted with success!"
            })
        } else {
            res.status(400).json({
                message: "Invalid Product Id!"
            })
        }
    })
    .catch(err => {
        return res.status(500).json({
            message: err.message,
        })
    })
}