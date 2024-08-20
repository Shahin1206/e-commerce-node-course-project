const path = require('path');

const express = require('express');
const check = require('express-validator').check;
const body = require('express-validator').body;

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// /admin/products => GET
router.get('/products',isAuth, adminController.getProducts);

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// /admin/add-product => POST
router.post('/add-product',isAuth,
            [
                body('title').isString().isLength({min: 3}).trim(),
                body('imageUrl').isURL(),
                body('price').isFloat({gt: 0}),
                body('description').isLength({min: 5, max: 500}).trim()
            ], 
            adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product', isAuth, adminController.postEditProduct);

router.post('/delete-product',isAuth, adminController.postDeleteProduct);

module.exports = router;
