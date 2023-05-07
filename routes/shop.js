const express = require('express');
const router = express.Router();
// const path = require('path');

// const rootDir = require('../util/path');
const adminData = require('./admin');

router.get('/', (req, res, next) => {
  console.log('adminData.products', adminData.products);
  const products = adminData.products;
  res.render('home', {
    products: products,
    pageTitle: 'Home',
    path: '/',
    
  });
  //   res.sendFile(path.join(rootDir, 'views', 'home.pug'));
});

module.exports = router;
