const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    cart: [
      { product_id: { type: Number }, quantity: { type: Number, default: 1 } },
    ],
    phone: { type: String, default: "" },
    avatar: { type: String, default: "" },
    location: { type: String, default: "" },
    verifyToken: { type: String },
    verify: { type: Boolean },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("user", userSchema);
module.exports = {
  User: User,
};
