const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const options = {};

mongoose
  .connect(process.env.MONGODB_URL, options)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

module.exports = mongoose;
