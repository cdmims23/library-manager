const express = require('express');
const app = express();
const path = require('path');
const createError = require('http-errors');

// Set up view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Routers
const routes = require('./routes/index');
const books = require('./routes/book');

app.use('/', routes);
app.use('/book', books);


// catch 404 and forward to error handler
app.use( (req, res, next) => {
    next(createError(404));
  });
  
// error handler
app.use( (err, req, res, next) => {
// set locals, only providing error in development
res.locals.message = err.message;
res.locals.error = req.app.get('env') === 'development' ? err : {};

// render the error page
res.status(err.status || 500);
res.render('page-not-found');
});




module.exports = app;