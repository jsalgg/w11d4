// ./routes.js

const express = require("express");
const db = require('./db/models')

const router = express.Router();

const asyncHandler = (handler) => {
  return (req, res, next) => {
    return handler(req, res, next).catch(next)
  }
};

router.get("/", asyncHandler (async(req, res) => {
  // throw new Error('This is a test error!');
  const books = await db.Book.findAll(
    { order: [['title', 'ASC']]}
  );

  res.render('book-list', { title: 'Books', books });


}));

module.exports = router;
