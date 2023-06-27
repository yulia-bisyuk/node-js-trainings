exports.get404 = (req, res, next) => {
  res.status(404).render('404', {
    pageTitle: 'Error',
    errorMessage: 'Page not found',
    path: '/404',
    isLoggedIn: req.session.isLoggedIn,
  });
};

exports.get500 = (req, res, next) => {
  res.status(500).render('500', {
    pageTitle: 'Error',
    errorMessage: 'Database Error occurred!',
    path: '/500',
    isLoggedIn: req.session.isLoggedIn,
  });
};
