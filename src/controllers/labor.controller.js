const Information = require("../models/information.model");
const Labor = require("../models/labor.model");
const User = require("../models/user.model");

function LaborController() {
  this.getAll = async (req, res) => {
    try {
      const users = await User.find()
        .select("email role labor_id")
        .populate({
          path: "labor_id",
          populate: {
            path: "information_id",
          },
        });

      res.status(200).json(users);
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

  this.create = async (req, res) => {
    try {
      const {
        email,
        password,
        firstName,
        lastName,
        gender,
        dob,
        phone,
        address,
        position,
        rate_per_hour,
      } = req.body;

      const user = new User({ email, password });
      await user.save();

      const information = new Information({
        firstName,
        lastName,
        gender,
        dob,
        phone,
        address,
      });
      await information.save();

      const labor = new Labor({
        position,
        rate_per_hour,
        information_id: information._id,
      });
      await labor.save();

      user.labor_id = labor._id;
      information.labor_id = labor._id;
      await user.save();
      await information.save();

      res.status(201).json({ message: "Created labor successfully" });
    } catch (error) {
      res.status(500).json({ error: "Created faild!" });
    }
  };

  this.update = async (req, res) => {
    try {
      const laborId = req.params.id;
      const {
        position,
        rate_per_hour,
        firstName,
        lastName,
        gender,
        dob,
        phone,
        address,
      } = req.body;

      const labor = await Labor.findByIdAndUpdate(
        laborId,
        { position, rate_per_hour },
        { new: true }
      );

      if (!labor) {
        return res.status(404).json({ error: "Labor not found" });
      }

      let information = await Information.findById(labor.information_id);

      if (!information) {
        information = new Information({
          firstName,
          lastName,
          gender,
          dob,
          phone,
          address,
        });
        await information.save();

        labor.information_id = information._id;
        await labor.save();
      } else {
        information.firstName = firstName;
        information.lastName = lastName;
        information.gender = gender;
        information.dob = dob;
        information.phone = phone;
        information.address = address;
        await information.save();
      }

      res.status(200).json({ message: "Updated labor successfully" });
    } catch (error) {
      res.status(500).json({ error: "Update failed" });
    }
  };

  return this;
}

module.exports = LaborController();
