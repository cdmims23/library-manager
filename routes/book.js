const express = require('express');
const { sequelize } = require('../models');
const {Sequelize} = require('../models');
const router = express.Router();
const Book = require('../models').Book;
const Op = Sequelize.Op
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

router.post('/search', asyncHandler(async (req, res) => {
  let attributes = [];
  let where = {[Op.or]: {}};

  for(const key in req.body) {
    if(req.body[key]) {
      attributes.push(key);
        where[Op.or][key] = {[Op.like]: `%${req.body[key]}%`}
    }
  }
  const books = await Book.findAll({where: where})
  console.log(books);
  console.log(attributes);
  console.log(where);
  res.render('index', {books});
}));

router.get('/new', asyncHandler(async (req, res) => {
  res.render('new-book', {});
}));

router.post('/new', asyncHandler(async (req, res) => {
  let book;
  try {
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

router.post('/search', asyncHandler(async(req, res) => {

  res.send("Search Route Works!")
}))


module.exports = router;

