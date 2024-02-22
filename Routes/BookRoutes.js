const express = require("express");
const router = express.Router();
const {
  addBook,
  getBooks,
  getBook,
  deleteBook,
  updateBook,
  getBookCopies,
  findByAuthor,
  borrowBook,
  getBorrowHistory,
} = require("../Controllers/BookController");
const accessTokenHandler = require("../Middlewares/TokenHandler");

router.use(accessTokenHandler);
router.post("/add-book", addBook);
router.get("/get-books", getBooks);
router.route("/:id").get(getBook).delete(deleteBook).put(updateBook);
router.get("/:id/available-copies", getBookCopies);
router.get("/:author/search-by-author", findByAuthor);
router.get("/:id/borrow-book", borrowBook);
router.get("/borrow-history", getBorrowHistory);
module.exports = router;
