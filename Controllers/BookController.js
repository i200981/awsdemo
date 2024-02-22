const Book = require("../Models/BookModel");
const asyncHandler = require("express-async-handler");
const User = require("../Models/UserModel");

//adding a new book to the library
const addBook = asyncHandler(async (req, res) => {
  //only admins are allowed to add a new book
  if (req.user.role == "admin") {
    //destruct req.body
    const title = req.body.title.trim();
    const author = req.body.author.trim();
    const isbn = req.body.ISBN || req.body.isbn;
    const publicationDate = req.body.publicationDate;
    const genre = req.body.genre.trim();
    const copies = req.body.copies;

    if (!title || !author || !isbn || !genre || !copies) {
      res.status(400);
      throw new Error(
        "One or more fields are empty and this message is from express async handler"
      );
    }

    //checking username length
    if (title.length < 3) {
      res.status(400);
      throw new Error("Title should have atleast 3 characters");
    }

    if (author.length < 3) {
      res.status(400);
      throw new Error("Author should have atleast 3 characters");
    }

    //check if a user already exists
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      res.status(400);
      throw new Error("Book already registered in library");
    }

    //create new user with hashed password
    const newBook = await Book.create({
      title,
      author,
      ISBN: isbn,
      publicationDate,
      genre,
      copies,
      borrowHistory: [],
    });

    //in case new user is not created
    if (!newBook) {
      res.status(400);
      throw new Error("Could not add book");
    }

    //send username and email as a response
    res.status(200).json({ newBook });

    console.log(newBook);
  }

  //students can not add a book
  else {
    res.status(401);
    throw new Error(
      "Students can not add a new book. Students are not authorized"
    );
  }
});

const getBooks = asyncHandler(async (req, res) => {
  //find all the books
  const books = await Book.find({});

  if (!books) {
    res.status(404);
    throw new Error("Books could not be found");
  }

  res.status(200).json({ books });
  console.log("All the books:", books);
});

const getBook = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const existingBook = await Book.findById({ _id: id });

  if (!existingBook) {
    res.status(404);
    throw new Error("Book not found");
  }

  res.status(200).json({
    existingBook,
  });
  console.log("Get a book: ", existingBook);
});

const deleteBook = asyncHandler(async (req, res) => {
  //only admins can delete books
  if (req.user.role == "admin") {
    const deletedBook = await Book.findByIdAndDelete({ _id: req.params.id });
    if (!deletedBook) {
      res.status(404);
      throw new Error("Book not found!");
    }

    res.status(200).json({ deletedBook });
  }

  //students can not delete a book
  else {
    res.status(401);
    throw new Error(
      "Students can not delete a book. Students are not authorized"
    );
  }
});

const updateBook = asyncHandler(async (req, res) => {
  //only admins can update books
  if (req.user.role == "admin") {
    const id = req.params.id;
    const title = req.body.title.trim();
    const author = req.body.author.trim();
    const isbn = req.body.isbn;
    const genre = req.body.genre.trim();
    const copies = req.body.copies;

    if (!title || !author || !isbn || !genre || !copies) {
      res.status(400);
      throw new Error("One or more fields are empty");
    }
    const existingBook = await Book.findOne({ _id: id });

    if (!existingBook) {
      res.status(404);
      throw new Error("User not found!");
    }
    const updatedBook = await Book.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedBook) {
      res.status(500);
      throw new Error("Could not updated the Book");
    }
    res.status(200).json(updatedBook);
  }

  //students can not update a book
  else {
    res.status(401);
    throw new Error(
      "Students can not update a book. Students are not authorized"
    );
  }
});

const getBookCopies = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const existingBook = await Book.findOne({ _id: id });
  if (!existingBook) {
    res.status(404);
    throw new Error("Could not find the book");
  }

  res.status(200).json({ Copies: existingBook.copies });
  console.log("copies", existingBook.copies);
});

const findByAuthor = asyncHandler(async (req, res) => {
  const author = req.params.author;
  if (!author) {
    res.status(400);
    throw new Error("No author is entered");
  }

  //case insensitive
  const partialAuthorName = new RegExp(author, "i");

  const existingBooks = await Book.find({ author: partialAuthorName });

  if (!existingBooks) {
    res.status(404);
    throw new Error("Books by author name could not be found");
  }
  res.status(200).json(existingBooks);
});

const borrowBook = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!id) {
    res.status(400);
    throw new Error("Id of the book to borrow is not provided");
  }

  const existingBook = await Book.findOne({ _id: id });

  if (!existingBook) {
    res.status(404);
    throw new Error("Could not find the book");
  }

  if (existingBook.copies <= 0) {
    res.status(400);
    throw new Error("Out of stock");
  }
  const updatedCopies = existingBook.copies - 1;
  const updatedBook = await Book.findByIdAndUpdate(
    id,
    { copies: updatedCopies },
    {
      new: true,
    }
  );

  if (!updatedBook) {
    res.status(500);
    throw new Error("Could not borrow book");
  }

  console.log("reached till borrowing");
  //we already have the current user in req.user
  //set borrow date to current date
  const borrowDate = new Date();
  //set due date to 7 days from now
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 7);

  const currentUser = await User.findById(req.user.id);
  //create an object for borrowedBook
  console.log("req.user : ", req.user);
  //push the object to borrowedBook array in user model
  console.log("req.user.borrowedBook:", currentUser.borrowedBook);
  const book = {
    book: existingBook._id,
    borrowDate: borrowDate,
    dueDate: dueDate,
  };
  currentUser.borrowedBook.push(book);
  await currentUser.save();
  console.log("Borrowed Books : ", currentUser.borrowedBook);

  //maintain the borrow history of the book as well
  console.log("existing book", existingBook.borrowHistory);
  existingBook.borrowHistory.push(currentUser);
  console.log("existing book", existingBook.borrowHistory);
  res.status(200).json(updatedBook);
});

const getBorrowHistory = asyncHandler(async (req, res) => {
  const id = req.params.id;
});

module.exports = {
  addBook,
  getBooks,
  getBook,
  deleteBook,
  updateBook,
  getBookCopies,
  findByAuthor,
  borrowBook,
  getBorrowHistory,
};
