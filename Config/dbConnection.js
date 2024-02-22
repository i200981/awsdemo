const mongoose = require("mongoose");

const connectdb = async () => {
  try {
    const connect = await mongoose.connect(
      "mongodb+srv://Wajid_Ali:wajidali@library.48dxobe.mongodb.net/?retryWrites=true&w=majority"
    );
    console.log("DB connection successful", connect.connection.host);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectdb;
