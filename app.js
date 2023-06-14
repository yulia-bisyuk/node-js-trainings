const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const errorController = require('./controllers/404');

app.set('view engine', 'ejs');
app.set('views', 'views');

const rootDir = require('./util/path');
const User = require('./models/user');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, 'public')));

app.use((req, res, next) => {
  User.findById('64875c181db6d28e5876b71b')
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

mongoose
  .connect(
    'mongodb+srv://yuliabisyuk:Vhnr5LTEvWaxcne4@cluster0.exx11wp.mongodb.net/shop?retryWrites=true&w=majority'
  )
  .then(() => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: 'Yuliia',
          email: 'yuliia@test.com',
          cart: { items: [] },
        });
        user.save();
      }
    });
    app.listen(3000);
    console.log('Connected!');
  })
  .catch((err) => console.log(err));
