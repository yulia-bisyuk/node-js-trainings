const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const adminController = require('../controllers/admin');
const isAuth = require('../middlewares/is-auth');

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);
// /admin/add-product => POST
router.post(
  '/add-product',
  [
    check('title')
      .trim()
      .isString()
      .isLength({ min: 3 })
      .withMessage('Title should be a string with minimum 3 characters length'),

    // check('imageUrl').isURL().withMessage('Please enter valid URL'),

    check('price')
      .isFloat()
      .withMessage('Price should be a number with floating point'),

    check('description')
      .isString()
      .trim()
      .isLength({ min: 3, max: 200 })
      .withMessage('Description should have minimum 3 characters length'),
  ],
  isAuth,
  adminController.postAddProduct
);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);
router.post(
  '/edit-product',
  [
    check('title')
      .trim()
      .isString()
      .isLength({ min: 3 })
      .withMessage('Title should be a string with minimum 3 characters length'),
    // check('imageUrl').isURL().withMessage('Please enter valid URL'),
    check('price')
      .isFloat()
      .withMessage('Price should be a number with floating point'),
    check('description')
      .isString()
      .trim()
      .isLength({ min: 3, max: 200 })
      .withMessage('Description should have minimum 3 characters length'),
  ],
  isAuth,
  adminController.postEditProduct
);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

// /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

module.exports = router;
