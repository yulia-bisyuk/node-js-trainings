const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

// this package is deprecated but used here for learning purposes
// and understanding the logic of CSRF attacks protection
const csrf = require('csurf');
const flash = require('connect-flash');

const MONGODB_URI =
  'mongodb+srv://yuliabisyuk:Vhnr5LTEvWaxcne4@cluster0.exx11wp.mongodb.net/shop?retryWrites=true&w=majority';

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'mySessions',
});

const fileStorage = multer.diskStorage({
  // sets the place for storing files
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  // provides unique name for file
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
  //
});

//controls which files should be uploaded and which should be skipped
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

const rootDir = require('./util/path');
const User = require('./models/user');
const errorController = require('./controllers/error');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

store.on('error', function (error) {
  console.log(error);
});
// bodyParser can't handle parsing file data, only string data
app.use(bodyParser.urlencoded({ extended: false }));
// use multer for parsing file data or mixed data ('image' - is a name of input with type='file')
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use('/images', express.static(path.join(rootDir, 'images')));
app.use(express.static(path.join(rootDir, 'public')));
app.use(
  session({
    secret: 'long string value',
    store: store,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  // allows us to set local variables, that are passed to the views (they will only exist in the views, that are rendered)
  res.locals.isLoggedIn = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      // this WILL NOT work for general error middleware
      // because it is called inside async function
      // throw new Error(err);

      // this WILL work for general error middleware
      next(new Error(err));
    });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);
app.use(errorController.get404);

// middleware which handles error after you call next(error) in catch() block
// you can have multiple error handling middlewares
// they will be executed one by one
app.use((error, req, res, next) => {
  //res.status(error.httpCodeStatus).render(...);
  res.redirect('/500');
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(3000);
    console.log('Connected!');
  })
  .catch((err) => console.log(err));
