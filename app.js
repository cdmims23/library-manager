const express = require('express');
const app = express();
const path = require('path');
const Book = require('./models').Book;

// Set up view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Routers
const routes = require('./routes');
const books = require('./routes/book');

app.use('/', routes);
app.use('/books', books);


















module.exports = app;