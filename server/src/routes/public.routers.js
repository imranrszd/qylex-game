const express = require('express');
const router = express.Router();

router.use('/products', require('./products.routes'));
router.use('/validate', require('./validate.routes'));

module.exports = router;