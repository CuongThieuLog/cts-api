const User = require("../models/user.model");
const BaseController = require("./base.controller");

function UserController() {
  const baseController = BaseController;

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

  this.getAll = async (req, res) => {
    try {
      const { page, limit, role, email } = req.query;
      let query = baseController.appendFilters({}, { role, email });
      let eloquent = (queryBuilder) => {
        return queryBuilder.select("email role labor_id").populate({
          path: "labor_id",
          populate: {
            path: "information_id",
          },
        });
      };

      const { results, pagination } = await baseController.pagination(
        User,
        query,
        eloquent,
        page,
        limit
      );

      res.status(200).json({
        data: results,
        pagination: pagination,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to fetch labor data" });
    }
  };

  this.getById = async (req, res) => {
    const userId = req.params.id;

    try {
      const user = await User.findById(userId)
        .select("email role labor_id")
        .populate({
          path: "labor_id",
          populate: {
            path: "information_id",
          },
        });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user data by id" });
    }
  };

  return this;
}

module.exports = UserController();
