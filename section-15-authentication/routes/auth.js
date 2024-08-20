const express = require('express');
const check = require('express-validator').check;
const body = require('express-validator').body;

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);


router.post('/login',
            [body('email', 'Please enter a valid email').isEmail().normalizeEmail(),    
            body('password', 'Password must be of minimum 8 characters and contain alphabets and numbers').isLength({min: 8}).isAlphanumeric().trim()],
            authController.postLogin);


router.post('/signup', 
            [check('email')
                .isEmail()
                .withMessage('Please enter a valid email')
                .custom((value, {req}) => {
                    return User.findOne({email: value})
                               .then(user => {
                                if(user) {
                                    return Promise.reject("User with this email already exists!");
                                }
                                return true;
                               })
                })
                .normalizeEmail(), 
            body('password', 'Password must be of minimum 8 characters, must only contain alphabets and numbers, and must not contain whitespaces').isLength({min: 8}).isAlphanumeric().trim(),
            body('confirmPassword', 'Passwords do not match!').custom((value, {req}) => {
                if(value !== req.body.password) {
                    return false;
                }
                return true;
            }).trim()],
            authController.postSignup);


router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;