// const db = require('../util/database');
// const Cart = require('./cart');

// module.exports = class Product {
//   constructor(id, title, price, description, imageUrl) {
//     this.id = id;
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//   }

//   save() {
//     return db.execute(
//       'INSERT INTO products (title, price, description, imageUrl) VALUES (?, ?, ?, ?)',
//       [this.title, this.price, this.description, this.imageUrl]
//     );
//   }

//   static fetchAllProducts() {
//     return db.execute('SELECT * FROM products');
//   }

//   static findProductById(id) {
//     return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
//   }

//   static deleteProductById(id) {}
// };

//using Sequilize

const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const Product = sequelize.define('product', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Product;
