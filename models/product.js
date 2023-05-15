const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path');
const p = path.join(rootDir, 'data', 'products.json');

const Cart = require('./cart');

const getProductsFromFile = (cb) => {
  fs.readFile(p, (error, fileContent) => {
    if (error) {
      console.log(error);
      return cb([]);
    }

    cb(JSON.parse(fileContent));
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, price, description) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save() {
    getProductsFromFile((products) => {
      if (this.id) {
        const existingProductIndex = products.findIndex(
          (prod) => prod.id === this.id
        );
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedProducts), (error) => {
          console.log(error);
        });
      } else {
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (error) => {
          console.log(error);
        });
      }
    });
  }

  static fetchAllProducts(cb) {
    getProductsFromFile(cb);
  }

  static findProductById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === id);
      cb(product);
    });
  }

  static deleteProductById(id) {
    getProductsFromFile((products) => {
      const product = products.find((product) => product.id === id);
      const updatedProducts = products.filter((p) => p.id !== id);
      fs.writeFile(p, JSON.stringify(updatedProducts), (error) => {
        if (!error) {
          Cart.deleteProduct(id, product.price);
        }
      });
    });
  }
};
