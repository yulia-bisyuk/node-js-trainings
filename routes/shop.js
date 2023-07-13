const express = require('express');
const router = express.Router();

const shopController = require('../controllers/shop');
const isAuth = require('../middlewares/is-auth');

router.get('/', shopController.getIndexPage);
router.get('/products', shopController.getProducts);
router.get('/products/:productId', shopController.getProductItem);
router.get('/cart', isAuth, shopController.getCart);
router.post('/cart', isAuth, shopController.postCart);
router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);
router.get('/checkout', isAuth, shopController.getCheckout);
router.get('/checkout/success', shopController.getCheckoutSuccess);
router.get('/checkout/cancel', shopController.getCheckout);
router.get('/orders', isAuth, shopController.getOrders);
router.get('/orders/:orderId', isAuth, shopController.getInvoice);

module.exports = router;
