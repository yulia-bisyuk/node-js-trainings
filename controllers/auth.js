const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    isLoggedIn: req.session.isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById('64875c181db6d28e5876b71b')
    .then((user) => {
      req.session.user = user;
      req.session.isLoggedIn = true;
      // saving the session assures us that the data is saved and we can safely redirect
      // (normally we don't have to do this)
      req.session.save((err) => {
        console.log(err);
        res.redirect('/');
      });
    })
    .catch((err) => console.log(err));

  // Cookies logic
  // res.setHeader('Set-Cookie', 'isLoggedIn=true');
  // we can set multiple values for cookies (expires in 10 seconds,
  // we can add a domain, where cookies should be sent
  // Secure (without equal sign) - will set cookies only through http request
  // HttpOnly - we can't now access cookie value through client-side (protects us from cross-site scrypt attacs)
  // )
  // res.setHeader('Set-Cookie', 'isLoggedIn=true; Max-Age=10'; Domain=''; Secure; HttpOnly);
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  });
};
