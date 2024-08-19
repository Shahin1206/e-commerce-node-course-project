const crypto = require('crypto'); 

const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const validationResult = require('express-validator').validationResult;

const User = require('../models/user');

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "333aa032f88c5d",
    pass: "f0f0ea600807d2"
  }
});

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if(message.length > 0)
  {
    message = message[0];
  }
  else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if(message.length > 0)
  {
    message = message[0];
  }
  else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message
  });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
      .then(user => {
        if (!user) {
          req.flash('error', 'Invalid email or password');
          return res.redirect('/login');
        }
        console.log("Before bcrypt compare");
        console.log(`Req body password ${req.body.password} and User Password ${user.password}`);
        bcrypt.compare(req.body.password, user.password)
          .then(doMatch => {
            if (doMatch) {
              req.session.isLoggedIn = true;
              req.session.user = user;
              return req.session.save(err => {
                console.log(err);
                res.redirect('/');
              });
            }
            res.redirect('/login');
          })
          .catch(err => {
            console.log(err);
            res.redirect('/login');
          });
      })
      .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);
  console.log("errors in express validator check");
  

  if(!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('auth/signup',{
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg
    });
  }
  User.findOne({email: email})
      .then(userDoc => {
        if(userDoc) {
          req.flash('error', 'User with this email already exists!');
          // console.log('Email already exists');
          return res.redirect('/signup');
        }
          return bcrypt.hash(password, 12)
          .then(hashedPassword => {
            const user = new User({email: email, password: hashedPassword, cart: {items: []}});
            console.log("User signup data: ", user);
            return user.save();
          })
          .then(result => {
            res.redirect('/login');
            return transport.sendMail({
              to: email,
              from: 'shop@node-complete.com',
              subject: 'Signup Succeeded!',
              html: '<h1>You successfully signed up!</h1>'
            })
          });
      })
      .catch(err => {
        console.log(err);
      })
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req,res,next) => {
  let message = req.flash('error');
  if(message.length > 0)
  {
    message = message[0];
  }
  else {
    message = null;
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  });
};

exports.postReset = (req,res,next) => {
  console.log("inside post reset");
  crypto.randomBytes(32, (err,buffer) => {
    if(err) {
      console.log(err);
      return res.redirect('/reset');
    }
    console.log('User wth given email found in reset pswd');
    
    const token = buffer.toString('hex');
    User.findOne({email: req.body.email})
        .then((user) => {
          if(!user) {
            res.flash('error', 'User with given email not found!');
            return res.redirect('/reset');
          }
          user.resetToken = token;
          user.resetTokenExpiration = Date.now() + 3600000;
          return user.save();
        })
        .then(result => {
          res.redirect('/');
          transport.sendMail({
            to: req.body.email,
            from: 'shop@node-complete.com',
            subject: 'Password Reset',
            html: `
            <p>You requested a password reset</p>
            <p>Click on the 
            <a href="http://localhost:3000/reset/${token}">link</a>
             to set a new password </p>`
          })
        })
        .catch(err => {
          console.log(err);
        });
  })
};

exports.getNewPassword = (req,res,next) => {
  console.log("inside get new password");
  
  const token = req.params.token;

  User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
      .then(user => {
        let message = req.flash('error');
        if (message.length > 0) {
          message = message[0];
        }
        else {
          message = null;
        }
        return res.render('auth/new-password', {
          path: '/new-password',
          pageTitle: 'New Password',
          errorMessage: message,
          userId: user._id.toString(),
          passwordToken: token
        });
      })
      .catch(err => {
        console.log(err);
      });
};

exports.postNewPassword = (req,res,next) => {
  const newPasswrod = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({resetToken: passwordToken, resetTokenExpiration: {$gt: Date.now()}, _id: userId})
      .then(user => {
        resetUser = user;
        return bcrypt.hash(newPasswrod, 12);
      })
      .then(hashedPassword => {
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;

        return resetUser.save();
      })
      .then(result => {
        res.redirect('/login')
      })
      .catch(err => {
        console.log(err);
      });
};