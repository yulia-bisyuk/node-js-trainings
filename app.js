const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

const errorController = require('./controllers/404');

app.set('view engine', 'ejs');
app.set('views', 'views');

const rootDir = require('./util/path');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

app.listen(3000);
