const Product = require('../models/product');
const { validationResult } = require('express-validator');
const fileHelper = require('../util/file');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMessage: null,
    isLoggedIn: req.session.isLoggedIn,
    validationErrors: [],
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, price, description } = req.body;
  const image = req.file;
  const errors = validationResult(req);

  if (!image) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      errorMessage: 'Attached file is not an image',
      validationErrors: [],
      product: {
        title: title,
        price: price,
        description: description,
      },
    });
  }

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      errorMessage: 'Attached file is not an image',
      validationErrors: [],
      product: {
        title: title,
        price: price,
        description: description,
      },
    });
  }

  // adding slash / before product.imageUrl makes path absolute
  // so it will not append it to the current path, but rather create a new path
  const imageUrl = image.path;

  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user,
  });

  product
    .save()
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch((err) => {
      console.log(`err: `, err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      // returning next with error argument means that express.js will skip all next
      // middlewares except those who handle errors
      return next(error);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const productId = req.params.productId;
  Product.findById(productId)
    .then((product) => {
      if (!product) {
        res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
        product,
        isLoggedIn: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const image = req.file;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
      product: {
        _id: prodId,
        title: updatedTitle,
        price: updatedPrice,
        description: updatedDescription,
      },
    });
  }

  Product.findById(prodId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      product.title = updatedTitle;
      if (image) {
        fileHelper.deleteFile(product.imageUrl);
        product.imageUrl = image.path;
      }
      product.price = updatedPrice;
      product.description = updatedDescription;
      return product.save().then(() => {
        console.log('Product updated!');
        res.redirect('/admin/products');
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((prod) => {
      if (!prod) {
        return next(new Error('Product not found'));
      }
      fileHelper.deleteFile(prod.imageUrl);
      return Product.deleteOne({ _id: prodId, userId: req.user._id });
    })
    .then(() => res.redirect('/admin/products'))
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    // .select('title price') // you tell which fields will be retrieved from database
    // .populate('userId') // tells mongoose to populate the certain field
    // with all details information,
    // not just the 'id' - it will be the full user object
    .then((products) => {
      // console.log(`products: `, products);

      res.render('admin/products', {
        products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        isLoggedIn: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
