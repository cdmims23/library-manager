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
  res.render('index', { books, search: false });
}));

// Route for search feature
router.post('/search', asyncHandler(async (req, res) => {
  let where = {[Op.or]: {}};
    if(req.body.search) {
      where[Op.or]['title'] = {[Op.like]: `%${req.body['search']}%`}
      where[Op.or]['author'] = {[Op.like]: `%${req.body['search']}%`}
      where[Op.or]['genre'] = {[Op.like]: `%${req.body['search']}%`}
      where[Op.or]['year'] = {[Op.like]: `%${req.body['search']}%`}
    }
    
  const books = await Book.findAll({where: where})
  res.render('index', {books, search: true});
}));


// GET and POST routes to add new books
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
      res.render("form-error", { book, errors: error.errors})
    } else {
      throw error;
    }  
  }
}));

// GET and POST routes to update books.
router.get('/:id/', (async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render("update-book", { book });      
  } else {
    // Error handling for books that don't exist
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

// Delete route
router.post('/:id/delete/', asyncHandler(async (req ,res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    await book.destroy();
    res.redirect("/");
  } else {
    res.sendStatus(404);
  }
}));




module.exports = router;

