// as this is a middleware so it has access to res, req objects
const errorHandler = (err, req, res, next) => {
  //get status code from the res object
  const code = res.statusCode ? res.statusCode : 500;
  switch (code) {
    case 404:
      res.json({
        Error: "NOT FOUND!",
        Message: err.message,
      });
      break;

    case 400:
      res.json({
        Error: "VALIDATION ERROR!",
        Message: err.message,
      });
      break;

    case 401:
      res.json({
        Error: "UNAUTHORIZED!",
        Message: err.message,
      });
      break;

    case 500:
      res.json({
        Error: "SERVER ERROR!",
        Message: err.message,
      });
      break;

    case 200:
      res.json({
        Error: "OK!",
        Message: err.message,
      });

    case 201:
      res.json({
        Error: "RESOURCE CREATED!",
        Message: err.message,
      });
      break;

    case 409:
      res.json({
        Error: "ALREADY EXISTS!",
        Message: err.message,
      });
      break;

    default:
      console.log("Everything is working OK!");
      break;
  }
};

module.exports = errorHandler;
