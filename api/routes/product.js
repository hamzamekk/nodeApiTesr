const express = require('express');
const router = express.Router();

//models
const ProductController = require('../controllers/product');

//middleware
const checkAuth = require('../middleware/check-auth');


router.get('/',  ProductController.get_AllProducts);

router.post('/',checkAuth, ProductController.creatProduct);

router.delete('/:productId', checkAuth, ProductController.deleteProduct);


module.exports = router;