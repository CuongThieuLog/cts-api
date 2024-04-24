const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token || !token.startsWith("Bearer ")) {
      return res
        .status(401)
        .send({ error: "Authorization token is missing or invalid" });
    }

    const tokenValue = token.replace("Bearer ", "");
    const data = jwt.verify(tokenValue, process.env.JWT_KEY);
    const user = await User.findOne({
      _id: data._id,
      "tokens.token": tokenValue,
    });

    if (!user) {
      throw new Error();
    }
    req.user = user;
    req.token = tokenValue;
    next();
  } catch (error) {
    res.status(401).send({ error: "Not authorized to access this resource" });
  }
};

module.exports = auth;
