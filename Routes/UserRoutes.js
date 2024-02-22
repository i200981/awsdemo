const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getStudents,
  getStudent,
  deleteStudent,
  updateStudent,
  getBorrowedBooks,
  extendDueDate,
  getBorrowHistory,
} = require("../Controllers/UserContoller");
const accessTokenHandler = require("../Middlewares/TokenHandler");

router.post("/register", register);
router.post("/login", login);
router.use(accessTokenHandler);
//only admin can view all the users.
router.get("/get-users", getStudents);
router.route("/:id").get(getStudent).delete(deleteStudent).put(updateStudent);
router.get("/:id/borrowed-books", getBorrowedBooks);
router.put("/:id/extend-due-date", extendDueDate);
router.get("/borrow-history", getBorrowHistory);
module.exports = router;
