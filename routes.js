// ./routes.js
//external
const express = require("express");
const csrf = require("csurf");
const { check, validationResult } = require("express-validator");
//internal
const db = require("./db/models");

const router = express.Router();

const csrfProtection = csrf({ cookie: true });

const asyncHandler = (handler) => {
  return (req, res, next) => {
    return handler(req, res, next).catch(next);
  };
};

router.get("/book/add", csrfProtection, (req, res) => {
  const book = db.Book.build();
  res.render("book-add", {
    title: "Add Book",
    book,
    csrfToken: req.csrfToken(),
  });
});

const bookValidators = [
  check("title")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a value for Title")
    .isLength({ max: 255 })
    .withMessage("Title must not be more than 255 characters long"),
  check("author")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a value for Author")
    .isLength({ max: 100 })
    .withMessage("Author must not be more than 100 characters long"),
  check("releaseDate")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a value for Release Date")
    .isISO8601()
    .withMessage("Please provide a valid date for Release Date"),
  check("pageCount")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a value for Page Count")
    .isInt({ min: 0 })
    .withMessage("Please provide a valid integer for Page Count"),
  check("publisher")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a value for Publisher")
    .isLength({ max: 100 })
    .withMessage("Publisher must not be more than 100 characters long"),
];

router.post(
  "/book/add",
  csrfProtection,
  bookValidators,
  asyncHandler(async (req, res, next) => {
    const { title, author, releaseDate, pageCount, publisher } = req.body;
    // console.log("we have hit post route");
    const book = db.Book.build({
      title,
      author,
      releaseDate,
      pageCount,
      publisher,
    });
    const validatorErrors = validationResult(req);
    console.log(validatorErrors);
    if (validatorErrors.isEmpty()) {
      await book.save();
      res.redirect("/");
    } else {
      const errors = validatorErrors.array().map((error) => error.msg);
      res.render("book-add", {
        title: "Add Book",
        book,
        errors,
        csrfToken: req.csrfToken(),
      });
    }
  })
);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    // throw new Error('This is a test error!');
    const books = await db.Book.findAll({ order: [["title", "ASC"]] });

    res.render("book-list", { title: "Books", books });
  })
);

module.exports = router;
