const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

/* Handler function to wrap each route. */
function asyncHandler(cb){
    return async(req, res, next) => {
      try {
        await cb(req, res, next)
      } catch(error){
        res.status(500).send(error);
      }
    }
  }

router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  res.render('index', { books });
}));

router.get('/new', asyncHandler(async (req, res) => {
  res.render('new-book', {});
}));

router.post('/new', asyncHandler(async (req, res) => {
  await Book.create(req.body);
  res.redirect('/');
}));

router.get('/:id/', (async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  res.render('update-book', { book });
}));

router.post('/:id/', (async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if(book) {
      await book.update(req.body);
      res.redirect("/"); 
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render("book-detail", { book, errors: error.errors, title: "Edit Book" })
    } else {
      throw error;
    }
  }
}));


module.exports = router;

