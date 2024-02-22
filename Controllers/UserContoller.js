const User = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

// instead of using try catch in every function, I am using express async hanlder
//create a new user
const register = asyncHandler(async (req, res) => {
  //destruct req.body
  const username = req.body.username.trim();
  const email = req.body.email.trim();
  const password = req.body.password.trim();
  const role = req.body.role;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error(
      "One or more fields are empty and this message is from express async handler"
    );
  }

  //checking username length
  if (username.length < 5) {
    res.status(400);
    throw new Error("Username should have atleast 5 characters");
  }

  //checking password length
  if (password.length < 5) {
    res.status(400);
    throw new Error("Password should have atleast 5 characters");
  }

  //check if email contains @ sign
  if (!email.includes("@") || !email.includes(".com") || email.length < 11) {
    res.status(400);
    throw new Error("Email is not valid");
  }

  //check if a user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error("User already registered with this email");
  }

  //hash the password before storing in db
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("hashed password: ", password);

  //create new user with hashed password
  const newUser = await User.create({
    username: username,
    email: email,
    password: hashedPassword,
    role: role,
    borrowedBook: [],
    borrowHistory: [],
  });

  //in case new user is not created
  if (!newUser) {
    res.status(400);
    throw new Error("Could not create user");
  }

  //send username and email as a response
  res.status(200).json({
    username,
    email,
    role,
  });

  console.log(newUser);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //check if email or password are empty
  if (!email || !password) {
    res.status(400);
    throw new Error("Email or password is empty");
  }

  //check if this email exists or not
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not registered with us!");
  }

  //compare the the password with the hashed password stored in database
  const comparedPasword = await bcrypt.compare(password, user.password);
  if (!comparedPasword) {
    res.status(400);
    throw new Error("Incorrect password!");
  }

  const accessToken = jwt.sign(
    {
      user: {
        username: user.username,
        email: user.email,
        registrationDate: user.registrationDate,
        role: user.role,
        id: user.id,
        registrationDate: user.registrationDate,
      },
    },
    "wajidali",
    { expiresIn: "24h" }
  );
  res.status(200).json({ accessToken });
  console.log("accessToken :", accessToken);
});

//get all the students
const getStudents = asyncHandler(async (req, res) => {
  if (req.user.role != "admin") {
    res.status(401);
    throw new Error("Only admin can view all the users. You are not an admin");
  }
  //find all the users
  const users = await User.find({});

  if (!users) {
    res.status(404);
    throw new Error("Users could not be found");
  }

  res.status(200).json({ users });
  console.log("All the users:", users);
});

//get one student
const getStudent = asyncHandler(async (req, res) => {
  const id = req.params.id;

  //if the logged in user us a student then they can get themselves only not others
  if (req.user.role == "student") {
    const existingUser = await User.findById({ _id: req.user.id });

    if (!existingUser) {
      res.status(404);
      throw new Error("User not found");
    }

    res.status(200).json({
      existingUser,
    });
    console.log("Get a user: ", existingUser);
  }

  //if the logged in user is an admin then they can view any user in the system
  const existingUser = await User.findById({ _id: id });

  if (!existingUser) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    existingUser,
  });
});

//delete a user
const deleteStudent = asyncHandler(async (req, res) => {
  //student can delete themselves only
  if (req.user.role == "student" && req.params.id == req.user.id) {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      res.status(404);
      throw new Error("User not found!");
    }
  }

  //admin can delete any user
  const isAdmin = await User.findById(req.params.id);

  //one admin can not delete another admin
  if (isAdmin.role == "admin") {
    res.status(401);
    throw new Error("You can not delete another admin");
  }
  const deletedUser = await User.findByIdAndDelete(req.params.id);
  if (!deletedUser) {
    res.status(404);
    throw new Error("User not found!");
  }

  res.status(200).json({ deletedUser });
});

//updating user profile
const updateStudent = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const username = req.body.username.trim();
  const email = req.body.email.trim();
  const password = req.body.password.trim();

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("One or more fields are empty");
  }

  //a student can update only their profiles
  if (req.user.role == "student" && id == req.user.id) {
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
  }

  //admin can update any profiles other than other admins

  const existingUser = await User.findOne({ _id: id });

  //an admin can not update another admin
  if (existingUser.role == "admin") {
    res.status(401);
    throw new Error(
      "You are not authorized to update another admin. One admin can not update another admin"
    );
  }

  if (!existingUser) {
    res.status(404);
    throw new Error("User not found!");
  }
  const updatedUser = await User.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!updatedUser) {
    res.status(500);
    throw new Error("Could not updated User");
  }
  res.status(200).json(updatedUser);
});

const getBorrowedBooks = () => {
  console.log("getBorrowedBooks");
};
const extendDueDate = () => {
  console.log("extendDueDate");
};
const getBorrowHistory = () => {
  console.log("getBorrowHistory");
};

module.exports = {
  register,
  login,
  getStudents,
  getStudent,
  deleteStudent,
  updateStudent,
  getBorrowedBooks,
  extendDueDate,
  getBorrowHistory,
};
