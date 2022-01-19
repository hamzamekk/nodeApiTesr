const express = require("express");
const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).json({
      message: 'Handling GET response to /orders'
  })
})


router.post('/', (req, res, next) => {
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity,
    };
    res.status(200).json({
        message: 'Handling POST response to /orders',
        createdOrder: order,
    })
  })

  router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    if(id === 'special'){
        res.status(200).json({
            message: 'special id',
            id: id,
        })
    } else {
        res.status(200).json({
            message: 'You passed an Id'
        })
    }
  })
  

  router.patch('/:orderId', (req, res, next) => {
        res.status(200).json({
            message: 'order updated!'
        })
  })

  router.delete('/:orderId', (req, res, next) => {
        res.status(200).json({
            message: 'order deleted'
        })
  })
  

  module.exports = router;