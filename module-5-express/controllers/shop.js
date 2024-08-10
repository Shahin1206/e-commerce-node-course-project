// const products = [];

const Product = require('../models/product'); 
const { patch } = require('../routes/admin');

const getProducts = (req,res) => {
    Product.fetchAll((products) => {
      res.render('shop/products-list', {
        prods: products,
        pageTitle: 'Products List',
        path: '/',
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true
      });
    }); 
  };


const getIndex = (req,res,next) => {
  Product.fetchAll((products) => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Product By Index',
      path: '/'
    });
  }); 
}  


const getCart = (req,res,next) => {
  res.render('shop/cart', {
    path: '/cart',
    pageTitle: 'Your Cart '
  });
}


const getOrders = (req,res,next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders '
  });
}


const getCheckout = (req,res,next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
}

module.exports = {
    getProducts,
    getIndex,
    getCart,
    getCheckout,
    getOrders
}