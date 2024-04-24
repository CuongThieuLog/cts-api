const { error } = require("./log");

const handleError = (err, req, res) => {
  error(err); // Write log

  //TODO : depend on your web (JSON or web normal), you can show ideal error page .
  const statusCode = 500;
  const message = err.message;

  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
  });
};

module.exports = handleError;
