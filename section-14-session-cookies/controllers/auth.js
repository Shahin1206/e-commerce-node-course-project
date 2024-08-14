const User = require('../models/user');

exports.getLogin = (req,res,next) => {
    // const isLoggedIn = req.get('Cookie').split('=')[1];
    console.log(req.session);
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
    });
};

exports.postLogin = (req,res,next) => {
    // req.session.isLoggedIn = true;
    User.findById('66b7119f9e971c9e5d339c58')
    .then(user => {
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save(err => {
            console.log(err);
            res.redirect('/');
        })
      })
        .catch(err => {console.log("ERR IN POST LOGIN: ",err);})
    // res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly');
    // req.isLoggedIn = true;
    // res.redirect('/');     
};


exports.postLogout = (req,res,next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });
};

//  /home/shahin/Documents/New Node Course/section-14-session-cookies/views/auth/login.ejs