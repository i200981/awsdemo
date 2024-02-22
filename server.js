const express = require("express");
const server = express();
const env = require("dotenv").config();
const dbConnection = require("./Config/dbConnection");
const studentRouter = require("./Routes/UserRoutes");
const bookRouter = require("./Routes/BookRoutes");
const errorHandler = require("./Middlewares/ErrorHandler");
dbConnection();
server.use(express.json());

server.use("/user", studentRouter);
server.use("/book", bookRouter);

server.use(errorHandler);
server.listen(5001, () => {
  console.log("Server is running on port 5001");
});
