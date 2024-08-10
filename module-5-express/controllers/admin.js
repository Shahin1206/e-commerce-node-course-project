const Product = require('../models/product') 

const getAddProducts = (req,res) => {
    res.render('admin/add-product', {
        pageTitle: 'Add Product', 
        path: '/admin/add-product', 
        formCSS: true, 
        productCSS: true, 
        activeAddProduct: true})
};

const postAddProducts = (req,res,next) => {
    // products.push({title: req.body.title});
    const title = req.body.title;
    const imageURL = req.body.imageURL;
    const description = req.body.description;
    const price = req.body.price;
    const product = new Product(title, imageURL, description, price);
    product.save();
    res.redirect('/');
};

const getProducts = (req,res) => {
    Product.fetchAll((products) => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      });
    }); 
  };

module.exports = {
    getAddProducts,
    postAddProducts,
    getProducts
}