const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
// const engineHbs = require('express-handlebars');

// app.engine(
//   'hbs',
//   engineHbs({
//     layoutsDir: 'views/layouts/',
//     defaultLayout: 'main-layout',
//     extname: 'hbs',
//   })
// );
app.set('view engine', 'ejs');
app.set('views', 'views');

const rootDir = require('./util/path');
const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, 'public')));

app.use(adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res
    .status(404)
    .render('404', {
      pageTitle: 'Error',
      errorMessage: 'Page not found',
      path: '',
    });
  //   res.status(404).sendFile(path.join(rootDir, 'views', '404.html'));
});

app.listen(3000);
