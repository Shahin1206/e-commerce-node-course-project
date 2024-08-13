const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const User = require('./models/user')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById("66b7119f9e971c9e5d339c58")
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://shahinbharthu:z13IccVxhHFrPzND@cluster0.fzsvc.mongodb.net/onlineshop?retryWrites=true&w=majority&appName=Cluster0')
        .then(result => {
          User.findOne().then(user => {
            if(!user) {
              const user = new User({
                name: "Max",
                email:"max@test.com",
                cart: {
                  items: []
                }
              });
              user.save();  
            }
          })
          console.log('Mongo connected using mongoose');     
          app.listen(3000);
        })
        .catch(err => {
          console.log(err);
        })