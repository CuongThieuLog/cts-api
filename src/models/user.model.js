const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      lowercase: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, "is invalid"],
      index: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 7,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    role: {
      type: Number,
      // enum: ["Admin", "Manager", "User"],
      enum: [0, 1, 2],
      required: true,
      default: 2,
    },
    labor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Labor",
      default: null,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

UserSchema.methods.toAuthJSON = function () {
  return {
    email: this.email,
    token: this.generateAuthToken(),
  };
};

UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
    },
    process.env.JWT_KEY
  );
  this.tokens = this.tokens.concat({ token });
  this.save();

  return token;
};

UserSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error({ error: "Invalid login credentials" });
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new Error({ error: "Invalid login credentials" });
  }

  return user;
};

UserSchema.methods.changePassword = async function (oldPassword, newPassword) {
  const user = this;
  const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordMatch) {
    throw new Error("Current password is incorrect");
  }
  user.password = newPassword;
  await user.save();
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
