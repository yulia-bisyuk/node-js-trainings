const express = require('express');
const router = express.Router();
const { check, body } = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user');

router.get('/login', authController.getLogin);
router.post(
  '/login',
  check('email').isEmail().withMessage('Please enter valid email'),
  //   check(
  //     'password',
  //     'Please enter the password only with numbers and text and with length more than 3 and less then 5 characters '
  //   )
  //     .isLength({ min: 3, max: 5 })
  //     .isAlphanumeric(),
  authController.postLogin
);
router.get('/signup', authController.getSignup);
router.post(
  '/signup',

  [
    // checks email value everywhere
    check('email')
      .isEmail()
      .withMessage('Please enter valid email')
      // async validation for existing user
      .custom((value) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              'Email already exists, pick a different one!'
            );
          }
        });
      }),
    // checks value only in the req.body
    body(
      'password',
      // error message for all checks below
      'Please enter the password only with numbers and text and with length more than 3 and less then 5 characters '
    )
      .isLength({ min: 3, max: 5 })
      .isAlphanumeric(),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords have to match');
      }
      return true;
    }),
  ],
  // you can write your custom validator e.g.
  // .custom((value, { req }) => {
  //   if (value === 'test@test.com') {
  //     throw new Error('This email is forbidden');
  //   }
  //    return true;
  // }),
  authController.postSignup
);
router.post('/logout', authController.postLogout);
router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);

module.exports = router;
