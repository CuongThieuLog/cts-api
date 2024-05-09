const User = require("../models/user.model");

function AuthController() {
  this.login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findByCredentials(email, password);

      if (!user) {
        return res
          .status(401)
          .send({ error: "Login failed! Check authentication credentials" });
      }

      res.send({
        user: { _id: user._id, labor_id: user.labor_id, ...user.toAuthJSON() },
      });
    } catch (error) {
      res.status(400).send({ error: "Login failed" });
    }
  };

  this.logout = async (req, res) => {
    try {
      req.user.tokens = req.user.tokens.filter((token) => {
        return token.token != req.token;
      });

      await req.user.save();
      res.send({ message: "Logout Done!" });
    } catch (error) {
      res.status(500).send(error);
    }
  };

  this.logoutAll = async (req, res) => {
    try {
      req.user.tokens.splice(0, req.user.tokens.length);
      await req.user.save();
      res.send();
    } catch (error) {
      res.status(500).send(error);
    }
  };

  this.changePassword = async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
      await req.user.changePassword(oldPassword, newPassword);
      res.send({ message: "Password changed successfully" });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  };

  return this;
}

module.exports = AuthController();
