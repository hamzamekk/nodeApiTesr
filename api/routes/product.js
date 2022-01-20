const express = require('express');
const router = express.Router();

const ProductController = require('../controllers/product');


router.get('/', ProductController.get_AllProducts);

router.post('/', ProductController.creatProduct);

router.delete('/:productId', ProductController.deleteProduct);


module.exports = router;