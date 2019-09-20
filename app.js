const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const hbs = require('hbs');
const formidable = require('formidable'),
const { notifications } = require('./middlewares');

require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI);

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const homeRouter = require('./routes/home');
const profileRouter = require('./routes/profile');
const bandsRouter = require('./routes/bands');
const messageRouter = require('./routes/message');
const eventsRouter = require('./routes/events');
const searchRouter = require('./routes/search');
const chatRouter = require('./routes/chat');
const notificationsRouter = require('./routes/notifications');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

hbs.registerPartials(path.join(__dirname, 'views/partials'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  sassMiddleware({
    src: path.join(__dirname, 'sass'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: false, // true = .sass and false = .scss
    sourceMap: true
  })
);

app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60 // 1 day
    }),
    secret: 'ironhack',
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000
    }
  })
);

app.use(flash());
app.use((req, res, next) => {
  app.locals.currentUser = req.session.currentUser;
  next();
});

app.use(notifications());
app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/home', homeRouter);
app.use('/profile', profileRouter);
app.use('/bandas', bandsRouter);
app.use('/messages', messageRouter);
app.use('/events', eventsRouter);
app.use('/search', searchRouter);
app.use('/chat', chatRouter);
app.use('/notifications', notificationsRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.render('404');
  // next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
