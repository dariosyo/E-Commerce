const express = require('express');
const { check, validationResult } = require('express-validator');
const multer = require('multer');

const productRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const { requirePrice, requireTitle } = require('./validators')

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/admin/products', (req, res) => {


});


router.get('/admin/products/new', (req, res) => {
  res.send(productsNewTemplate({}));
});

router.post('/admin/products/new', [ requireTitle, requirePrice ], upload.single('image'), (req, res) => {
  const errors = validationResult(req);


  res.send('Submitted')
})

module.exports = router;
