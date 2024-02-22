const mongoose = require("mongoose");

const bookSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: 3,
    },
    author: {
      type: String,
      required: true,
      minLength: 3,
    },
    ISBN: {
      type: String,
      required: true,
      unique: true,
    },
    publicationDate: {
      type: Date,
    },
    genre: {
      type: String,
      required: true,
    },
    copies: {
      type: Number,
      required: true,
      default: 1,
    },
    borrowHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Books", bookSchema);
