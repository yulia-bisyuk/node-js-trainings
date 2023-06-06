const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const productId = req.params.productId;
  Product.findProductById(productId).then(([rows]) => {
    if (!rows) {
      res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: rows,
    });
  });
  // Product.findProductById(productId, (product) => {
  //   if (!product) {
  //     res.redirect('/');
  //   }
  //   res.render('admin/edit-product', {
  //     pageTitle: 'Edit Product',
  //     path: '/admin/edit-product',
  //     editing: editMode,
  //     product: product,
  //   });
  // });
};

exports.postEditProduct = (req, res, next) => {
  // const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  const updatedProduct = new Product(
    // prodId,
    updatedTitle,
    updatedPrice,
    updatedDescription,
    updatedImageUrl
  );
  updatedProduct.save().then(res.redirect('/admin/products'));
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;

  const product = new Product(null, title, price, description, imageUrl);

  product
    .save()
    .then(() => {
      res.redirect('/');
    })
    .catch((error) => console.log(error));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteProductById(prodId);
  res.redirect('/admin/products');
};

exports.getProducts = (req, res, next) => {
  Product.fetchAllProducts().then(([rows]) => {
    res.render('admin/products', {
      products: rows,
      pageTitle: 'Admin Products',
      path: '/admin/products',
    });
  });
  // Product.fetchAllProducts((products) => {
  //   res.render('admin/products', {
  //     products: products,
  //     pageTitle: 'Admin Products',
  //     path: '/admin/products',
  //   });
  // });
};
