const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAllProducts((products) => {
    res.render('shop/product-list', {
      products: products,
      pageTitle: 'All Products',
      path: '/products',
    });
  });
};

exports.getProductItem = (req, res, next) => {
  const productId = req.params.productId;
  Product.findProductById(productId, (product) => {
    res.render('shop/product-details', {
      product: product,
      pageTitle: product.name,
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
  Cart.getCart((cart) => {
    Product.fetchAllProducts((products) => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find(
          (prod) => product.id === prod.id
        );
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      res.render('shop/cart', {
        pageTitle: 'Cart',
        path: '/cart',
        products: cartProducts,
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;

  Product.findProductById(productId, (product) => {
    Cart.addProduct(productId, product.price);
  });
  res.redirect('/cart');
};

exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.findProductById(productId, (product) => {
    Cart.deleteProduct(productId, product.price);
    res.redirect('/cart');
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
