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

router.get('/', asyncHandler(async (req, res, next) => {
  const books = await Book.findAll();
  res.render('index', { books });
}));

router.get('/new', asyncHandler(async (req, res) => {
  res.render('new-book', {});
}));

router.post('/new', asyncHandler(async (req, res) => {
  let book;
  try {
    console.log(req.body);
    book = await Book.create(req.body);
    res.redirect("/");
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render("new-book", { book, errors: error.errors})
    } else {
      throw error;
    }  
  }
}));

router.get('/:id/', (async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render("update-book", { book });      
  } else {
    const error = new Error("Oh No! That book doesn't exist");
    error.status = 404;
    next(error)
  }
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
      res.render("update-book", { book, errors: error.errors, title: "Edit Book" })
    } else {
      throw error;
    }
  }
}));

router.post('/:id/delete/', asyncHandler(async (req ,res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    await book.destroy();
    res.redirect("/");
  } else {
    res.sendStatus(404);
  }
}));

router.post('search/', asyncHandler(async (req, res) => {
  let attributes = [];
  let where = {};

  for (const key in req.body) {
    if(key) {
      attributes.push(key);
      if(key === 'year') {
        where.year = req.body[key];
      }
      [key] = {
        [Op.like]: `%${req.body[key]}%`,
        [Op.iLike]: `%${req.body[key]}%`
      }
      where[key] = [key]
    }
  }
  console.log(where);
  res.redirect('/')
}));


module.exports = router;

