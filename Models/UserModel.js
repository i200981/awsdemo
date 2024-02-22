const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is a mandatory field"],
      minLength: 3,
    },
    email: {
      type: String,
      required: [true, "Email is a mandatory field"],
      unique: [true, "Email should be unique field"],
    },
    password: {
      type: String,
      required: [true, "Password is a mandatory field"],
      minLength: 5,
    },
    role: {
      type: String,
      required: [true, "Role is mandatory"],
      enum: ["student", "admin"],
      default: "student",
    },
    borrowedBook: [
      {
        book: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Books",
        },
        borrowDate: {
          type: Date,
          required: true,
          default: new Date(),
        },
        dueDate: {
          type: Date,
          required: true,
        },
      },
    ],
    borrowHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Books",
      },
    ],
    registrationDate: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Users", userSchema);
