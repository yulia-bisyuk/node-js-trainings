const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.fetchAllProducts((products) => {
    res.render('shop/product-list', {
      products: products,
      pageTitle: 'All Products',
      path: '/products',
    });
  });
};

exports.getIndexPage = (req, res, next) => {
  Product.fetchAllProducts((products) => {
    res.render('shop/index', {
      products: products,
      pageTitle: 'Shop',
      path: '/',
    });
  });
};

exports.getCart = (req, res, next) => {
  res.render('shop/cart', {
    pageTitle: 'Cart',
    path: '/cart',
  });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    pageTitle: 'Orders',
    path: '/orders',
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
  });
};
