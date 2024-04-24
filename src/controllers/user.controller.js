const User = require("../models/user.model");

function UserController() {
  this.find = async (req, res) => {
    return res.send(req.user);
  };

  this.register = (req, res) => {
    try {
      let user = new User();

      user.email = req.body.email;
      user.password = req.body.password;

      user
        .save()
        .then(function () {
          return res.json({ user: user.toAuthJSON() });
        })
        .catch(function (error) {
          return res.status(400).json(error);
        });
    } catch (error) {
      return res.status(400).json(error);
    }
  };

  return this;
}

module.exports = UserController();
