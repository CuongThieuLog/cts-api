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

  this.requestPasswordReset = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }

      await user.generatePasswordResetToken();

      // await sendPasswordResetEmail(user.email, user.resetPasswordToken);

      res.send({
        email: user.email,
        resetPasswordToken: user.resetPasswordToken,
        message: "Password reset email sent",
      });
    } catch (error) {
      res.status(500).send({ error: "Password reset request failed" });
    }
  };

  this.resetPassword = async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordTokenExpiration: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).send({ error: "Invalid or expired token" });
      }

      user.password = newPassword;

      user.resetPasswordToken = undefined;
      user.resetPasswordTokenExpiration = undefined;

      await user.save();

      res.send({ message: "Password reset successful" });
    } catch (error) {
      res.status(500).send({ error: "Password reset failed" });
    }
  };

  return this;
}

module.exports = AuthController();
