require("dotenv").config();
const express = require("express");
const port = process.env.PORT || 8080;

const app = express();
const route = require("./routes/index");
const bodyParser = require("body-parser");
const cors = require("cors");
const handleError = require("./common/error");
require("./database/mongoose");

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use("/api", route);

app.use((err, req, res, next) => {
  handleError(err, req, res);
});

app.listen(port, () => {
  console.log("Server listening on " + port);
});
